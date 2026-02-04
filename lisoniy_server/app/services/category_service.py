"""Category management service"""

from typing import Optional, List
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.terminology import Category, Term
from app.schemas.terminology import CategoryCreate, CategoryUpdate


class CategoryService:
    """Service for managing categories"""
    
    @staticmethod
    async def create_category(
        db: AsyncSession,
        category_data: CategoryCreate
    ) -> Category:
        """
        Create a new category
        
        Args:
            db: Database session
            category_data: Category creation data
            
        Returns:
            Created category
            
        Raises:
            ValueError: If slug already exists
        """
        # Check if slug exists
        existing = await CategoryService.get_by_slug(db, category_data.slug)
        if existing:
            raise ValueError(f"Category with slug '{category_data.slug}' already exists")
        
        category = Category(**category_data.model_dump())
        db.add(category)
        await db.flush()
        await db.refresh(category)
        
        return category
    
    @staticmethod
    async def get_by_id(db: AsyncSession, category_id: UUID) -> Optional[Category]:
        """Get category by ID"""
        result = await db.execute(
            select(Category).where(Category.id == category_id)
        )
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_by_slug(db: AsyncSession, slug: str) -> Optional[Category]:
        """Get category by slug"""
        result = await db.execute(
            select(Category).where(Category.slug == slug)
        )
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_all(db: AsyncSession) -> List[Category]:
        """Get all categories"""
        result = await db.execute(
            select(Category).order_by(Category.name)
        )
        return list(result.scalars().all())
    
    @staticmethod
    async def update_category(
        db: AsyncSession,
        category: Category,
        category_data: CategoryUpdate
    ) -> Category:
        """Update a category"""
        update_data = category_data.model_dump(exclude_unset=True)
        
        for field, value in update_data.items():
            setattr(category, field, value)
        
        await db.flush()
        await db.refresh(category)
        
        return category
    
    @staticmethod
    async def delete_category(db: AsyncSession, category: Category) -> None:
        """Delete a category (will cascade to terms)"""
        await db.delete(category)
        await db.flush()
    
    @staticmethod
    async def get_category_terms(
        db: AsyncSession,
        category_id: UUID,
        offset: int = 0,
        limit: int = 20
    ) -> tuple[List[Term], int]:
        """
        Get terms in a category with pagination
        
        Returns:
            Tuple of (terms list, total count)
        """
        # Get total count
        count_result = await db.execute(
            select(Term)
            .where(
                Term.category_id == category_id,
                Term.is_deleted == False
            )
        )
        total = len(list(count_result.scalars().all()))
        
        # Get paginated terms
        result = await db.execute(
            select(Term)
            .where(
                Term.category_id == category_id,
                Term.is_deleted == False
            )
            .options(
                selectinload(Term.definitions),
                selectinload(Term.category),
                selectinload(Term.creator)
            )
            .order_by(Term.created_at.desc())
            .offset(offset)
            .limit(limit)
        )
        
        terms = list(result.scalars().all())
        
        return terms, total
