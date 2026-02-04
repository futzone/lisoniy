"""Data entry service for managing dataset entries with hash-based deduplication"""

import json
import hashlib
from uuid import UUID, uuid4
from typing import Optional
from sqlalchemy import select, func, insert
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.dialects.postgresql import insert as pg_insert

from app.models.dataset import DataEntry, Dataset
from app.schemas.dataset import (
    DataEntryCreate,
    DataEntryUpdate,
    BulkOperationResult
)
from app.services.redis_manager import redis_manager


class DataEntryService:
    """Service for data entry operations with hash-based deduplication"""
    
    @staticmethod
    def generate_hash_key(dataset_id: UUID, content: dict) -> str:
        """
        Generate SHA256 hash for duplicate detection
        
        Args:
            dataset_id: Dataset ID
            content: Entry content
            
        Returns:
            SHA256 hash string (64 characters)
        """
        # Sort keys for consistent hashing
        content_str = json.dumps(content, sort_keys=True, ensure_ascii=False)
        hash_input = f"{dataset_id}{content_str}"
        return hashlib.sha256(hash_input.encode('utf-8')).hexdigest()
    
    @staticmethod
    async def check_duplicate(hash_key: str) -> bool:
        """
        Check if hash exists in Redis cache (fast duplicate check)
        
        Args:
            hash_key: Hash to check
            
        Returns:
            True if duplicate exists, False otherwise
        """
        cached = await redis_manager.get_value(f"hash:{hash_key}")
        return bool(cached)
    
    @staticmethod
    async def cache_hash(hash_key: str, ttl: int = 3600):
        """
        Cache hash in Redis
        
        Args:
            hash_key: Hash to cache
            ttl: Time to live in seconds (default 1 hour)
        """
        await redis_manager.set_value(f"hash:{hash_key}", "1", expire=ttl)
    
    @staticmethod
    async def create_entry(
        db: AsyncSession,
        entry_data: DataEntryCreate,
        user_id: UUID
    ) -> DataEntry:
        """
        Create a single data entry with duplicate check
        
        Args:
            db: Database session
            entry_data: Entry creation data
            user_id: Creator user ID
            
        Returns:
            Created entry
            
        Raises:
            ValueError: If duplicate entry exists
        """
        # Generate hash
        hash_key = DataEntryService.generate_hash_key(
            entry_data.dataset_id,
            entry_data.content
        )
        
        # Check duplicate in Redis (fast path)
        is_duplicate = await DataEntryService.check_duplicate(hash_key)
        if is_duplicate:
            raise ValueError("Duplicate entry detected")
        
        # Create entry
        entry = DataEntry(
            dataset_id=entry_data.dataset_id,
            content=entry_data.content,
            entry_metadata=entry_data.metadata,
            hash_key=hash_key,
            creator_id=user_id
        )
        
        db.add(entry)
        await db.flush()
        await db.refresh(entry)
        
        # Cache hash
        await DataEntryService.cache_hash(hash_key)
        
        # Invalidate dataset cache
        await DataEntryService.invalidate_dataset_cache(entry_data.dataset_id)
        
        return entry
    
    @staticmethod
    async def bulk_create_entries(
        db: AsyncSession,
        dataset_id: UUID,
        entries_data: list[dict],
        user_id: UUID
    ) -> BulkOperationResult:
        """
        Bulk create entries using PostgreSQL ON CONFLICT DO NOTHING
        
        Args:
            db: Database session
            dataset_id: Dataset ID
            entries_data: List of content dictionaries
            user_id: Creator user ID
            
        Returns:
            Bulk operation result
        """
        total = len(entries_data)
        created = 0
        skipped = 0
        errors = []
        
        # Prepare data with hashes
        insert_data = []
        hash_keys = []
        
        for idx, content in enumerate(entries_data):
            try:
                hash_key = DataEntryService.generate_hash_key(dataset_id, content)
                hash_keys.append(hash_key)
                
                insert_data.append({
                    "id": uuid4(),
                    "dataset_id": dataset_id,
                    "content": content,
                    "metadata": None,
                    "hash_key": hash_key,
                    "creator_id": user_id
                })
            except Exception as e:
                errors.append(f"Entry {idx}: {str(e)}")
        
        # Perform bulk insert with ON CONFLICT DO NOTHING
        if insert_data:
            stmt = pg_insert(DataEntry).values(insert_data)
            stmt = stmt.on_conflict_do_nothing(index_elements=['hash_key'])
            
            result = await db.execute(stmt)
            created = result.rowcount
            skipped = len(insert_data) - created
            
            # Cache all hashes in Redis
            for hash_key in hash_keys:
                await DataEntryService.cache_hash(hash_key)
            
            # Invalidate dataset cache
            await DataEntryService.invalidate_dataset_cache(dataset_id)
        
        return BulkOperationResult(
            total=total,
            created=created,
            skipped=skipped,
            failed=len(errors),
            errors=errors
        )
    
    @staticmethod
    async def get_by_id(
        db: AsyncSession,
        entry_id: UUID
    ) -> Optional[DataEntry]:
        """
        Get data entry by ID
        
        Args:
            db: Database session
            entry_id: Entry ID
            
        Returns:
            Data entry or None
        """
        query = select(DataEntry).where(DataEntry.id == entry_id)
        result = await db.execute(query)
        return result.scalar_one_or_none()
    
    @staticmethod
    async def search_entries(
        db: AsyncSession,
        dataset_id: Optional[UUID] = None,
        dataset_type: Optional[str] = None,
        offset: int = 0,
        limit: int = 20
    ) -> tuple[list[DataEntry], int]:
        """
        Search entries with filters and Redis caching
        
        Args:
            db: Database session
            dataset_id: Filter by dataset ID
            dataset_type: Filter by dataset type
            offset: Pagination offset
            limit: Pagination limit
            
        Returns:
            Tuple of (entries list, total count)
        """
        # Build cache key
        cache_key = f"entries:{dataset_id}:{dataset_type}:{offset}:{limit}"
        
        # TODO: Re-enable cache after fixing dict/object conversion
        # Try cache
        # cached = await redis_manager.get_value(cache_key)
        # if cached:
        #     try:
        #         cached_data = json.loads(cached)
        #         # Return cached result (need to reconstruct from dict)
        #         return cached_data['entries'], cached_data['total']
        #     except (json.JSONDecodeError, TypeError, KeyError):
        #         await redis_manager.delete_key(cache_key)
        
        # Build query
        filters = []
        
        if dataset_id:
            filters.append(DataEntry.dataset_id == dataset_id)
        
        if dataset_type:
            # Join with Dataset table to filter by type
            query = select(DataEntry).join(Dataset)
            filters.append(Dataset.type == dataset_type)
        else:
            query = select(DataEntry)
        
        # Get total count
        count_query = select(func.count()).select_from(query.subquery() if dataset_type else DataEntry)
        if filters:
            count_query = count_query.where(*filters)
        total = await db.scalar(count_query)
        
        # Get entries
        if filters:
            query = query.where(*filters)
        query = query.order_by(DataEntry.created_at.desc()).offset(offset).limit(limit)
        
        result = await db.execute(query)
        entries = result.scalars().all()
        
        # Cache result (store as dict, not model instances)
        cache_data = {
            'total': total,
            'entries': [
                {
                    'id': str(entry.id),
                    'dataset_id': str(entry.dataset_id),
                    'content': entry.content,
                    'metadata': entry.entry_metadata,
                    'hash_key': entry.hash_key,
                    'creator_id': str(entry.creator_id),
                    'created_at': entry.created_at.isoformat(),
                    'updated_at': entry.updated_at.isoformat()
                }
                for entry in entries
            ]
        }
        await redis_manager.set_value(cache_key, cache_data, expire=300)  # 5 min TTL
        
        return entries, total
    
    @staticmethod
    async def update_entry(
        db: AsyncSession,
        entry_id: UUID,
        update_data: DataEntryUpdate,
        user_id: UUID
    ) -> Optional[DataEntry]:
        """
        Update data entry
        
        Args:
            db: Database session
            entry_id: Entry ID
            update_data: Update data
            user_id: User ID (for authorization)
            
        Returns:
            Updated entry or None if not found/unauthorized
        """
        # Get entry
        query = select(DataEntry).where(
            DataEntry.id == entry_id,
            DataEntry.creator_id == user_id
        )
        result = await db.execute(query)
        entry = result.scalar_one_or_none()
        
        if not entry:
            return None
        
        # Update fields
        if update_data.content is not None:
            # Regenerate hash if content changed
            new_hash = DataEntryService.generate_hash_key(
                entry.dataset_id,
                update_data.content
            )
            entry.content = update_data.content
            entry.hash_key = new_hash
            await DataEntryService.cache_hash(new_hash)
        
        if update_data.metadata is not None:
            entry.entry_metadata = update_data.metadata
        
        await db.flush()
        await db.refresh(entry)
        
        # Invalidate cache
        await DataEntryService.invalidate_dataset_cache(entry.dataset_id)
        
        return entry
    
    @staticmethod
    async def delete_entry(
        db: AsyncSession,
        entry_id: UUID,
        user_id: UUID
    ) -> bool:
        """
        Delete data entry
        
        Args:
            db: Database session
            entry_id: Entry ID
            user_id: User ID (for authorization)
            
        Returns:
            True if deleted, False if not found/unauthorized
        """
        # Get entry
        query = select(DataEntry).where(
            DataEntry.id == entry_id,
            DataEntry.creator_id == user_id
        )
        result = await db.execute(query)
        entry = result.scalar_one_or_none()
        
        if not entry:
            return False
        
        dataset_id = entry.dataset_id
        await db.delete(entry)
        
        # Invalidate cache
        await DataEntryService.invalidate_dataset_cache(dataset_id)
        
        return True
    
    @staticmethod
    async def bulk_delete_entries(
        db: AsyncSession,
        entry_ids: list[UUID],
        user_id: UUID
    ) -> BulkOperationResult:
        """
        Bulk delete entries
        
        Args:
            db: Database session
            entry_ids: List of entry IDs to delete
            user_id: User ID (for authorization)
            
        Returns:
            Bulk operation result
        """
        total = len(entry_ids)
        deleted = 0
        errors = []
        
        # Get entries that belong to the user
        query = select(DataEntry).where(
            DataEntry.id.in_(entry_ids),
            DataEntry.creator_id == user_id
        )
        result = await db.execute(query)
        entries = result.scalars().all()
        
        deleted = len(entries)
        not_found = total - deleted
        
        if not_found > 0:
            errors.append(f"{not_found} entries not found or unauthorized")
        
        # Delete entries and collect dataset IDs for cache invalidation
        dataset_ids = set()
        for entry in entries:
            dataset_ids.add(entry.dataset_id)
            await db.delete(entry)
        
        # Invalidate caches
        for dataset_id in dataset_ids:
            await DataEntryService.invalidate_dataset_cache(dataset_id)
        
        return BulkOperationResult(
            total=total,
            deleted=deleted,
            failed=not_found,
            errors=errors
        )
    
    @staticmethod
    async def invalidate_dataset_cache(dataset_id: UUID):
        """
        Invalidate all cache keys for a dataset
        
        Args:
            dataset_id: Dataset ID
        """
        pattern = f"entries:{dataset_id}:*"
        async for key in redis_manager.redis.scan_iter(match=pattern):
            await redis_manager.delete_key(key)
