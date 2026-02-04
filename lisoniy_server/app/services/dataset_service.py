"""Dataset service for managing AI training datasets"""

from uuid import UUID
from typing import Optional
from sqlalchemy import select, func, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.dataset import Dataset
from app.schemas.dataset import DatasetCreate, DatasetUpdate


class DatasetService:
    """Service for dataset operations"""
    
    @staticmethod
    async def create_dataset(
        db: AsyncSession,
        dataset_data: DatasetCreate,
        user_id: UUID
    ) -> Dataset:
        """
        Create a new dataset
        
        Args:
            db: Database session
            dataset_data: Dataset creation data
            user_id: Creator user ID
            
        Returns:
            Created dataset
        """
        dataset = Dataset(
            name=dataset_data.name,
            type=dataset_data.type,
            description=dataset_data.description,
            is_public=dataset_data.is_public,
            creator_id=user_id
        )
        
        db.add(dataset)
        await db.flush()
        await db.refresh(dataset)
        
        # Create metadata for the dataset
        from app.services.dataset_meta_service import DatasetMetaService
        await DatasetMetaService.create_meta(db, dataset.id)
        
        return dataset
    
    @staticmethod
    async def get_by_id(
        db: AsyncSession,
        dataset_id: UUID,
        include_entry_count: bool = True,
        include_meta: bool = True
    ) -> Optional[Dataset]:
        """
        Get dataset by ID
        
        Args:
            db: Database session
            dataset_id: Dataset ID
            include_entry_count: Whether to include entry count
            include_meta: Whether to include metadata
            
        Returns:
            Dataset or None
        """
        from sqlalchemy.orm import selectinload
        query = select(Dataset).where(Dataset.id == dataset_id)
        
        if include_meta:
            query = query.options(selectinload(Dataset.meta))
            
        result = await db.execute(query)
        dataset = result.scalar_one_or_none()
        
        if dataset and include_entry_count:
            # Get entry count
            from app.models.dataset import DataEntry
            count_query = select(func.count()).where(DataEntry.dataset_id == dataset_id)
            count = await db.scalar(count_query)
            dataset.entry_count = count
        
        return dataset
    
    @staticmethod
    async def get_user_datasets(
        db: AsyncSession,
        user_id: UUID,
        offset: int = 0,
        limit: int = 20
    ) -> tuple[list[Dataset], int]:
        """
        Get datasets created by a user
        
        Args:
            db: Database session
            user_id: User ID
            offset: Pagination offset
            limit: Pagination limit
            
        Returns:
            Tuple of (datasets list, total count)
        """
        # Get total count
        count_query = select(func.count()).select_from(Dataset).where(
            Dataset.creator_id == user_id
        )
        total = await db.scalar(count_query)
        
        # Get datasets
        query = select(Dataset).where(
            Dataset.creator_id == user_id
        ).order_by(Dataset.created_at.desc()).offset(offset).limit(limit)
        
        result = await db.execute(query)
        datasets = result.scalars().all()
        
        # Get entry counts for each dataset
        from app.models.dataset import DataEntry
        for dataset in datasets:
            count_query = select(func.count()).where(DataEntry.dataset_id == dataset.id)
            count = await db.scalar(count_query)
            dataset.entry_count = count
        
        return datasets, total
    
    @staticmethod
    async def get_public_datasets(
        db: AsyncSession,
        dataset_type: Optional[str] = None,
        sort_by: str = "new",
        offset: int = 0,
        limit: int = 20
    ) -> tuple[list[Dataset], int]:
        """
        Get public datasets with sorting
        
        Args:
            db: Database session
            dataset_type: Filter by dataset type
            sort_by: Sorting method (new, top, largest)
            offset: Pagination offset
            limit: Pagination limit
            
        Returns:
            Tuple of (datasets list, total count)
        """
        from app.models.dataset_meta import DatasetMeta
        
        # Build query
        filters = [Dataset.is_public == True]
        if dataset_type:
            filters.append(Dataset.type == dataset_type)
        
        # Get total count
        count_query = select(func.count()).select_from(Dataset).where(*filters)
        total = await db.scalar(count_query)
        
        # Base query with meta join for sorting
        query = select(Dataset).where(*filters)
        
        # Apply sorting
        if sort_by == "top":
            # Sort by stars and views
            query = query.outerjoin(DatasetMeta, Dataset.id == DatasetMeta.dataset_id)
            query = query.order_by(
                func.coalesce(DatasetMeta.stars_count, 0).desc(),
                func.coalesce(DatasetMeta.views_count, 0).desc(),
                Dataset.created_at.desc()
            )
        elif sort_by == "largest":
            # Sort by entry count (we already calculate this, but for order_by we might need a join or subquery)
            # For simplicity, we'll use a subquery or join with entry counts if possible, 
            # but usually entry_count is a business logic field. 
            # In our case, we calculate it later. Let's do a join with func.count of DataEntry.
            from app.models.dataset import DataEntry
            query = (
                select(Dataset)
                .outerjoin(DataEntry, Dataset.id == DataEntry.dataset_id)
                .where(*filters)
                .group_by(Dataset.id)
                .order_by(func.count(DataEntry.id).desc(), Dataset.created_at.desc())
            )
        else: # Default: new
            query = query.order_by(Dataset.created_at.desc())
            
        # Apply pagination
        query = query.offset(offset).limit(limit)
        
        result = await db.execute(query)
        datasets = result.scalars().all()
        
        # Get entry counts for each dataset (to populate the field)
        from app.models.dataset import DataEntry
        for dataset in datasets:
            count_query = select(func.count()).where(DataEntry.dataset_id == dataset.id)
            count = await db.scalar(count_query)
            dataset.entry_count = count
        
        return datasets, total
    
    @staticmethod
    async def update_dataset(
        db: AsyncSession,
        dataset_id: UUID,
        update_data: DatasetUpdate,
        user_id: UUID
    ) -> Optional[Dataset]:
        """
        Update dataset
        
        Args:
            db: Database session
            dataset_id: Dataset ID
            update_data: Update data
            user_id: User ID (for authorization)
            
        Returns:
            Updated dataset or None if not found/unauthorized
        """
        # Get dataset
        query = select(Dataset).where(
            Dataset.id == dataset_id,
            Dataset.creator_id == user_id
        )
        result = await db.execute(query)
        dataset = result.scalar_one_or_none()
        
        if not dataset:
            return None
        
        # Update fields
        if update_data.name is not None:
            dataset.name = update_data.name
        if update_data.description is not None:
            dataset.description = update_data.description
        if update_data.is_public is not None:
            dataset.is_public = update_data.is_public
        
        await db.flush()
        await db.refresh(dataset)
        
        return dataset
    
    @staticmethod
    async def delete_dataset(
        db: AsyncSession,
        dataset_id: UUID,
        user_id: UUID
    ) -> bool:
        """
        Delete dataset (and cascade to entries)
        
        Args:
            db: Database session
            dataset_id: Dataset ID
            user_id: User ID (for authorization)
            
        Returns:
            True if deleted, False if not found/unauthorized
        """
        # Get dataset
        query = select(Dataset).where(
            Dataset.id == dataset_id,
            Dataset.creator_id == user_id
        )
        result = await db.execute(query)
        dataset = result.scalar_one_or_none()
        
        if not dataset:
            return False
        
        await db.delete(dataset)
        return True
    
    @staticmethod
    async def search_datasets(
        db: AsyncSession,
        query_text: Optional[str] = None,
        dataset_type: Optional[str] = None,
        user_id: Optional[int] = None,
        include_public: bool = True,
        offset: int = 0,
        limit: int = 20
    ) -> tuple[list[Dataset], int]:
        """
        Search datasets with filters
        
        Args:
            db: Database session
            query_text: Search in name/description
            dataset_type: Filter by type
            user_id: Filter by creator (if None and include_public=True, show public only)
            include_public: Include public datasets
            offset: Pagination offset
            limit: Pagination limit
            
        Returns:
            Tuple of (datasets list, total count)
        """
        # Build filters
        filters = []
        
        if user_id:
            if include_public:
                filters.append(
                    or_(Dataset.creator_id == user_id, Dataset.is_public == True)
                )
            else:
                filters.append(Dataset.creator_id == user_id)
        elif include_public:
            filters.append(Dataset.is_public == True)
        
        if dataset_type:
            filters.append(Dataset.type == dataset_type)
        
        if query_text:
            search_pattern = f"%{query_text}%"
            filters.append(
                or_(
                    Dataset.name.ilike(search_pattern),
                    Dataset.description.ilike(search_pattern)
                )
            )
        
        # Get total count
        count_query = select(func.count()).select_from(Dataset)
        if filters:
            count_query = count_query.where(*filters)
        total = await db.scalar(count_query)
        
        # Get datasets
        query = select(Dataset)
        if filters:
            query = query.where(*filters)
        query = query.order_by(Dataset.created_at.desc()).offset(offset).limit(limit)
        
        result = await db.execute(query)
        datasets = result.scalars().all()
        
        # Get entry counts
        from app.models.dataset import DataEntry
        for dataset in datasets:
            count_query = select(func.count()).where(DataEntry.dataset_id == dataset.id)
            count = await db.scalar(count_query)
            dataset.entry_count = count
        
        return datasets, total
