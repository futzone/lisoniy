"""Service layer for dataset metadata and user interactions"""

import json
from typing import Optional, Tuple, List
from uuid import UUID
from datetime import datetime

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, update, delete
from sqlalchemy.orm import selectinload

from app.models.dataset import Dataset, DataEntry
from app.models.dataset_meta import DatasetMeta, DatasetStar, DatasetContributor
from app.models.user import User
from app.schemas.dataset_meta import DatasetMetaUpdate


class DatasetMetaService:
    """Service for managing dataset metadata and interactions"""
    
    @staticmethod
    async def create_meta(db: AsyncSession, dataset_id: UUID) -> DatasetMeta:
        """
        Create metadata record for a new dataset
        
        Args:
            db: Database session
            dataset_id: UUID of the dataset
            
        Returns:
            Created DatasetMeta instance
        """
        meta = DatasetMeta(dataset_id=dataset_id)
        db.add(meta)
        await db.flush()
        return meta
    
    @staticmethod
    async def get_meta(db: AsyncSession, dataset_id: UUID) -> Optional[DatasetMeta]:
        """
        Get metadata for a dataset
        
        Args:
            db: Database session
            dataset_id: UUID of the dataset
            
        Returns:
            DatasetMeta instance or None
        """
        result = await db.execute(
            select(DatasetMeta).where(DatasetMeta.dataset_id == dataset_id)
        )
        return result.scalar_one_or_none()
    
    @staticmethod
    async def update_meta(
        db: AsyncSession,
        dataset_id: UUID,
        update_data: DatasetMetaUpdate,
        user_id: int
    ) -> Optional[DatasetMeta]:
        """
        Update dataset metadata (creates if doesn't exist)
        
        Args:
            db: Database session
            dataset_id: UUID of the dataset
            update_data: Update data
            user_id: ID of user making the update
            
        Returns:
            Updated DatasetMeta instance or None
        """
        meta = await DatasetMetaService.get_meta(db, dataset_id)
        
        # Auto-create meta if it doesn't exist
        if not meta:
            meta = await DatasetMetaService.create_meta(db, dataset_id)
        
        update_dict = update_data.model_dump(exclude_unset=True)
        for field, value in update_dict.items():
            setattr(meta, field, value)
        
        meta.last_updated_user_id = user_id
        await db.flush()
        return meta

    @staticmethod
    async def increment_views(db: AsyncSession, dataset_id: UUID) -> None:
        """
        Increment view counter for a dataset (creates meta if missing)
        
        Args:
            db: Database session
            dataset_id: UUID of the dataset
        """
        # Try to update first
        result = await db.execute(
            update(DatasetMeta)
            .where(DatasetMeta.dataset_id == dataset_id)
            .values(views_count=func.coalesce(DatasetMeta.views_count, 0) + 1)
        )
        
        # If no meta record found, create one
        if result.rowcount == 0:
            meta = DatasetMeta(dataset_id=dataset_id, views_count=1)
            db.add(meta)
        
        await db.flush()

    
    @staticmethod
    async def star_dataset(db: AsyncSession, dataset_id: UUID, user_id: int) -> Optional[DatasetStar]:
        """
        Star a dataset (add favorite)
        
        Args:
            db: Database session
            dataset_id: UUID of the dataset
            user_id: ID of user starring
            
        Returns:
            Created DatasetStar instance or None if already starred
        """
        # Check if already starred
        existing = await db.execute(
            select(DatasetStar).where(
                DatasetStar.dataset_id == dataset_id,
                DatasetStar.user_id == user_id
            )
        )
        if existing.scalar_one_or_none():
            return None
        
        # Create star
        star = DatasetStar(dataset_id=dataset_id, user_id=user_id)
        db.add(star)
        
        # Increment stars_count
        await db.execute(
            update(DatasetMeta)
            .where(DatasetMeta.dataset_id == dataset_id)
            .values(stars_count=DatasetMeta.stars_count + 1)
        )
        
        await db.flush()
        return star
    
    @staticmethod
    async def unstar_dataset(db: AsyncSession, dataset_id: UUID, user_id: int) -> bool:
        """
        Unstar a dataset (remove favorite)
        
        Args:
            db: Database session
            dataset_id: UUID of the dataset
            user_id: ID of user unstarring
            
        Returns:
            True if unstarred, False if wasn't starred
        """
        result = await db.execute(
            delete(DatasetStar).where(
                DatasetStar.dataset_id == dataset_id,
                DatasetStar.user_id == user_id
            )
        )
        
        if result.rowcount > 0:
            # Decrement stars_count
            await db.execute(
                update(DatasetMeta)
                .where(DatasetMeta.dataset_id == dataset_id)
                .values(stars_count=func.greatest(DatasetMeta.stars_count - 1, 0))
            )
            await db.flush()
            return True
        
        return False
    
    @staticmethod
    async def is_starred_by(db: AsyncSession, dataset_id: UUID, user_id: int) -> bool:
        """
        Check if dataset is starred by user
        
        Args:
            db: Database session
            dataset_id: UUID of the dataset
            user_id: ID of user
            
        Returns:
            True if starred, False otherwise
        """
        result = await db.execute(
            select(DatasetStar).where(
                DatasetStar.dataset_id == dataset_id,
                DatasetStar.user_id == user_id
            )
        )
        return result.scalar_one_or_none() is not None
    
    @staticmethod
    async def get_stars(
        db: AsyncSession,
        dataset_id: UUID,
        offset: int = 0,
        limit: int = 20
    ) -> Tuple[List[DatasetStar], int]:
        """
        Get users who starred a dataset
        
        Args:
            db: Database session
            dataset_id: UUID of the dataset
            offset: Pagination offset
            limit: Pagination limit
            
        Returns:
            Tuple of (list of DatasetStar, total count)
        """
        # Get total count
        count_query = select(func.count()).where(DatasetStar.dataset_id == dataset_id)
        total = await db.scalar(count_query) or 0
        
        # Get stars with user data
        result = await db.execute(
            select(DatasetStar)
            .options(selectinload(DatasetStar.user))
            .where(DatasetStar.dataset_id == dataset_id)
            .order_by(DatasetStar.created_at.desc())
            .offset(offset)
            .limit(limit)
        )
        stars = list(result.scalars().all())
        
        return stars, total
    
    @staticmethod
    async def increment_downloads(db: AsyncSession, dataset_id: UUID) -> None:
        """
        Increment download counter for a dataset
        
        Args:
            db: Database session
            dataset_id: UUID of the dataset
        """
        await db.execute(
            update(DatasetMeta)
            .where(DatasetMeta.dataset_id == dataset_id)
            .values(downloads_count=func.coalesce(DatasetMeta.downloads_count, 0) + 1)
        )
        await db.flush()
    
    @staticmethod
    async def calculate_size(db: AsyncSession, dataset_id: UUID) -> int:
        """
        Calculate total size of dataset from entry contents
        
        Args:
            db: Database session
            dataset_id: UUID of the dataset
            
        Returns:
            Total size in bytes
        """
        result = await db.execute(
            select(DataEntry.content).where(DataEntry.dataset_id == dataset_id)
        )
        entries = result.scalars().all()
        
        total_size = 0
        for content in entries:
            # Calculate size of JSON content
            if content:
                total_size += len(json.dumps(content))
        
        return total_size
    
    @staticmethod
    async def update_size(db: AsyncSession, dataset_id: UUID) -> int:
        """
        Recalculate and update dataset size
        
        Args:
            db: Database session
            dataset_id: UUID of the dataset
            
        Returns:
            Updated size in bytes
        """
        size = await DatasetMetaService.calculate_size(db, dataset_id)
        
        await db.execute(
            update(DatasetMeta)
            .where(DatasetMeta.dataset_id == dataset_id)
            .values(size_bytes=size)
        )
        await db.flush()
        
        return size
    
    @staticmethod
    async def add_contributor(db: AsyncSession, dataset_id: UUID, user_id: int) -> DatasetContributor:
        """
        Add or update contributor record for a dataset
        
        Args:
            db: Database session
            dataset_id: UUID of the dataset
            user_id: ID of contributing user
            
        Returns:
            DatasetContributor instance
        """
        # Check if contributor exists
        result = await db.execute(
            select(DatasetContributor).where(
                DatasetContributor.dataset_id == dataset_id,
                DatasetContributor.user_id == user_id
            )
        )
        contributor = result.scalar_one_or_none()
        
        if contributor:
            # Update existing contributor
            contributor.contribution_count += 1
            contributor.last_contribution_at = datetime.utcnow()
        else:
            # Create new contributor
            contributor = DatasetContributor(
                dataset_id=dataset_id,
                user_id=user_id,
                contribution_count=1
            )
            db.add(contributor)
        
        await db.flush()
        return contributor
    
    @staticmethod
    async def get_contributors(
        db: AsyncSession,
        dataset_id: UUID,
        offset: int = 0,
        limit: int = 20
    ) -> Tuple[List[DatasetContributor], int]:
        """
        Get contributors for a dataset
        
        Args:
            db: Database session
            dataset_id: UUID of the dataset
            offset: Pagination offset
            limit: Pagination limit
            
        Returns:
            Tuple of (list of DatasetContributor, total count)
        """
        # Get total count
        count_query = select(func.count()).where(DatasetContributor.dataset_id == dataset_id)
        total = await db.scalar(count_query) or 0
        
        # Get contributors with user data
        result = await db.execute(
            select(DatasetContributor)
            .options(selectinload(DatasetContributor.user))
            .where(DatasetContributor.dataset_id == dataset_id)
            .order_by(DatasetContributor.contribution_count.desc())
            .offset(offset)
            .limit(limit)
        )
        contributors = list(result.scalars().all())
        
        return contributors, total
