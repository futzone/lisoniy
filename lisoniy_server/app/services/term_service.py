"""Term management service with business logic"""

import json
from datetime import datetime
from typing import Optional, List
from uuid import UUID

from sqlalchemy import select, or_, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy.exc import IntegrityError

from app.models.terminology import Term, Definition, Category, AuditAction
from app.schemas.terminology import (
    TermCreate, 
    TermUpdate, 
    BulkTermCreate,
    BulkOperationResult,
    SearchQuery
)
from app.services.audit_service import AuditService
from app.services.redis_manager import redis_manager


class TermService:
    """Service for managing terms with business logic"""
    
    @staticmethod
    async def create_term(
        db: AsyncSession,
        term_data: TermCreate,
        user_id: Optional[int] = None
    ) -> Term:
        """
        Create a new term with definitions in an atomic transaction
        
        Args:
            db: Database session
            term_data: Term creation data
            user_id: ID of the user creating the term
            
        Returns:
            Created term with definitions
            
        Raises:
            ValueError: If keyword already exists or category doesn't exist
        """
        # Check if keyword already exists
        existing = await TermService.get_by_keyword(db, term_data.keyword, include_deleted=True)
        if existing:
            if existing.is_deleted:
                raise ValueError(f"Term '{term_data.keyword}' is soft-deleted. Please restore it instead.")
            raise ValueError(f"Term '{term_data.keyword}' already exists")
        
        # Verify category exists
        category_result = await db.execute(
            select(Category).where(Category.id == term_data.category_id)
        )
        category = category_result.scalar_one_or_none()
        if not category:
            raise ValueError(f"Category with ID {term_data.category_id} not found")
        
        try:
            # Create term
            term = Term(
                keyword=term_data.keyword,
                category_id=term_data.category_id,
                creator_id=user_id,
                is_deleted=False
            )
            db.add(term)
            await db.flush()  # Get the term ID
            
            # Create definitions
            for def_data in term_data.definitions:
                definition = Definition(
                    term_id=term.id,
                    language=def_data.language,
                    text=def_data.text,
                    example=def_data.example,
                    is_approved=True  # Auto-approve
                )
                db.add(definition)
            
            await db.flush()
            
            # Log audit trail
            await AuditService.log_action(
                db=db,
                term_id=term.id,
                user_id=user_id,
                action=AuditAction.create,
                changes={"keyword": term_data.keyword, "definitions_count": len(term_data.definitions)}
            )
            
            await db.commit()
            
            # Refresh with relationships
            await db.refresh(term, ["definitions", "category", "creator"])
            
            # Invalidate cache
            await TermService._invalidate_term_cache(term.keyword, category.slug)
            
            return term
            
        except IntegrityError as e:
            await db.rollback()
            raise ValueError(f"Database integrity error: {str(e)}")
        except Exception as e:
            await db.rollback()
            raise
    
    @staticmethod
    async def get_by_keyword(
        db: AsyncSession,
        keyword: str,
        include_deleted: bool = False
    ) -> Optional[Term]:
        """
        Get term by keyword with caching
        
        Args:
            db: Database session
            keyword: Term keyword
            include_deleted: Whether to include soft-deleted terms
            
        Returns:
            Term if found, None otherwise
        """
        # Try cache first (only for non-deleted terms)
        if not include_deleted:
            cache_key = f"term:{keyword}"
            cached = await redis_manager.get(cache_key)
            if cached:
                # Return cached data (would need to deserialize properly in production)
                pass
        
        # Query database
        query = select(Term).where(Term.keyword == keyword)
        if not include_deleted:
            query = query.where(Term.is_deleted == False)
        
        query = query.options(
            selectinload(Term.definitions),
            selectinload(Term.category)
        )
        
        result = await db.execute(query)
        term = result.scalar_one_or_none()
        
        # Cache the result
        if term and not include_deleted:
            cache_key = f"term:{keyword}"
            # In production, serialize the term properly
            await redis_manager.set(cache_key, "cached", expire=3600)  # 1 hour
        
        return term
    
    @staticmethod
    async def get_by_id(
        db: AsyncSession,
        term_id: UUID,
        include_deleted: bool = False
    ) -> Optional[Term]:
        """Get term by ID"""
        query = select(Term).where(Term.id == term_id)
        if not include_deleted:
            query = query.where(Term.is_deleted == False)
        
        query = query.options(
            selectinload(Term.definitions),
            selectinload(Term.category)
        )
        
        result = await db.execute(query)
        return result.scalar_one_or_none()
    
    @staticmethod
    async def update_term(
        db: AsyncSession,
        term: Term,
        term_data: TermUpdate,
        user_id: Optional[int] = None
    ) -> Term:
        """
        Update a term
        
        Args:
            db: Database session
            term: Existing term
            term_data: Update data
            user_id: ID of the user updating the term
            
        Returns:
            Updated term
        """
        changes = {}
        update_data = term_data.model_dump(exclude_unset=True)
        
        for field, value in update_data.items():
            if getattr(term, field) != value:
                changes[field] = {
                    "old": str(getattr(term, field)),
                    "new": str(value)
                }
                setattr(term, field, value)
        
        if changes:
            # Log audit trail
            await AuditService.log_action(
                db=db,
                term_id=term.id,
                user_id=user_id,
                action=AuditAction.update,
                changes=changes
            )
        
        await db.commit()
        await db.refresh(term, ["definitions", "category", "creator"])
        
        # Invalidate cache
        await TermService._invalidate_term_cache(term.keyword, term.category.slug)
        
        return term
    
    @staticmethod
    async def delete_term(
        db: AsyncSession,
        term: Term,
        user_id: Optional[int] = None
    ) -> None:
        """
        Soft delete a term
        
        Args:
            db: Database session
            term: Term to delete
            user_id: ID of the user deleting the term
        """
        term.is_deleted = True
        term.deleted_at = datetime.utcnow()
        term.deleted_by = user_id
        
        # Log audit trail
        await AuditService.log_action(
            db=db,
            term_id=term.id,
            user_id=user_id,
            action=AuditAction.delete,
            changes={"keyword": term.keyword}
        )
        
        await db.flush()
        
        # Invalidate cache
        await TermService._invalidate_term_cache(term.keyword, term.category.slug)
    
    @staticmethod
    async def bulk_create_terms(
        db: AsyncSession,
        bulk_data: BulkTermCreate,
        user_id: Optional[int] = None
    ) -> List[BulkOperationResult]:
        """
        Create multiple terms efficiently
        
        Args:
            db: Database session
            bulk_data: Bulk creation data
            user_id: ID of the user creating terms
            
        Returns:
            List of operation results
        """
        results = []
        
        # Deduplicate input
        unique_keywords = {}
        for term_data in bulk_data.terms:
            if term_data.keyword not in unique_keywords:
                unique_keywords[term_data.keyword] = term_data
        
        # Check existing keywords in one query
        existing_result = await db.execute(
            select(Term.keyword).where(
                Term.keyword.in_(list(unique_keywords.keys()))
            )
        )
        existing_keywords = set(existing_result.scalars().all())
        
        # Process each term
        for keyword, term_data in unique_keywords.items():
            if keyword in existing_keywords:
                results.append(BulkOperationResult(
                    success=False,
                    keyword=keyword,
                    error="Keyword already exists"
                ))
                continue
            
            try:
                term = await TermService.create_term(db, term_data, user_id)
                results.append(BulkOperationResult(
                    success=True,
                    id=term.id,
                    keyword=term.keyword
                ))
            except Exception as e:
                results.append(BulkOperationResult(
                    success=False,
                    keyword=keyword,
                    error=str(e)
                ))
        
        return results
    
    @staticmethod
    async def bulk_delete_terms(
        db: AsyncSession,
        term_ids: List[UUID],
        user_id: Optional[int] = None
    ) -> List[BulkOperationResult]:
        """
        Delete multiple terms efficiently
        
        Args:
            db: Database session
            term_ids: List of term IDs to delete
            user_id: ID of the user deleting terms
            
        Returns:
            List of operation results
        """
        results = []
        
        # Get all terms in one query
        result = await db.execute(
            select(Term)
            .where(Term.id.in_(term_ids))
            .options(selectinload(Term.category))
        )
        terms = {term.id: term for term in result.scalars().all()}
        
        # Process each ID
        for term_id in term_ids:
            term = terms.get(term_id)
            if not term:
                results.append(BulkOperationResult(
                    success=False,
                    id=term_id,
                    error="Term not found"
                ))
                continue
            
            try:
                await TermService.delete_term(db, term, user_id)
                results.append(BulkOperationResult(
                    success=True,
                    id=term_id,
                    keyword=term.keyword
                ))
            except Exception as e:
                results.append(BulkOperationResult(
                    success=False,
                    id=term_id,
                    keyword=term.keyword,
                    error=str(e)
                ))
        
        await db.commit()
        return results
    
    @staticmethod
    async def search_terms(
        db: AsyncSession,
        search_query: SearchQuery
    ) -> tuple[List[Term], int]:
        """
        Multi-strategy search: exact match → partial match → full-text
        
        Args:
            db: Database session
            search_query: Search parameters
            
        Returns:
            Tuple of (terms list, total count)
        """
        # Try cache first
        cache_key = f"search:{search_query.q}:{search_query.language}:{search_query.category}"
        cached = await redis_manager.get(cache_key)
        if cached:
            # Would deserialize cached results
            pass
        
        results = []
        seen_ids = set()
        
        # 1. Exact match on keyword
        exact_query = select(Term).where(
            Term.keyword.ilike(search_query.q),
            Term.is_deleted == False
        )
        if search_query.category:
            category_result = await db.execute(
                select(Category).where(Category.slug == search_query.category)
            )
            category = category_result.scalar_one_or_none()
            if category:
                exact_query = exact_query.where(Term.category_id == category.id)
        
        exact_query = exact_query.options(
            selectinload(Term.definitions),
            selectinload(Term.category)
        )
        
        exact_result = await db.execute(exact_query)
        for term in exact_result.scalars().all():
            if term.id not in seen_ids:
                results.append(term)
                seen_ids.add(term.id)
        
        # 2. Partial match on keyword
        if len(results) < search_query.limit:
            partial_query = select(Term).where(
                Term.keyword.ilike(f"%{search_query.q}%"),
                Term.is_deleted == False,
                Term.id.notin_(seen_ids) if seen_ids else True
            )
            if search_query.category:
                category_result = await db.execute(
                    select(Category).where(Category.slug == search_query.category)
                )
                category = category_result.scalar_one_or_none()
                if category:
                    partial_query = partial_query.where(Term.category_id == category.id)
            
            partial_query = partial_query.options(
                selectinload(Term.definitions),
                selectinload(Term.category)
            ).limit(search_query.limit - len(results))
            
            partial_result = await db.execute(partial_query)
            for term in partial_result.scalars().all():
                if term.id not in seen_ids:
                    results.append(term)
                    seen_ids.add(term.id)
        
        # 3. Full-text search on definitions
        if len(results) < search_query.limit:
            fulltext_query = (
                select(Term)
                .join(Definition)
                .where(
                    Definition.search_vector.op('@@')(func.plainto_tsquery('simple', search_query.q)),
                    Term.is_deleted == False,
                    Term.id.notin_(seen_ids) if seen_ids else True
                )
            )
            
            if search_query.language:
                fulltext_query = fulltext_query.where(Definition.language == search_query.language)
            
            if search_query.category:
                category_result = await db.execute(
                    select(Category).where(Category.slug == search_query.category)
                )
                category = category_result.scalar_one_or_none()
                if category:
                    fulltext_query = fulltext_query.where(Term.category_id == category.id)
            
            fulltext_query = fulltext_query.options(
                selectinload(Term.definitions),
                selectinload(Term.category)
            ).limit(search_query.limit - len(results))
            
            fulltext_result = await db.execute(fulltext_query)
            for term in fulltext_result.scalars().all():
                if term.id not in seen_ids:
                    results.append(term)
                    seen_ids.add(term.id)
        
        # Apply pagination
        total = len(results)
        paginated = results[search_query.offset:search_query.offset + search_query.limit]
        
        # Cache the results
        await redis_manager.set(cache_key, "cached", expire=1800)  # 30 minutes
        
        return paginated, total
    
    @staticmethod
    async def _invalidate_term_cache(keyword: str, category_slug: Optional[str] = None) -> None:
        """Invalidate Redis cache for a term and its category"""
        # Invalidate term detail cache
        cache_key = f"term:{keyword}"
        await redis_manager.delete_key(cache_key)
        
        # Invalidate category terms list cache if slug provided
        if category_slug:
            pattern = f"category:{category_slug}:terms:*"
            await redis_manager.delete_pattern(pattern)
        
        # Also invalidate search cache (simplified - in production, track related searches)
        # await redis_manager.delete_pattern("search:*")
