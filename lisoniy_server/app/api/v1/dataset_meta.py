"""API endpoints for dataset metadata and user interactions"""

from uuid import UUID
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy import select

from app.db.session import get_db
from app.core.dependencies import get_current_active_user
from app.models.user import User
from app.models.dataset import Dataset
from app.services.dataset_meta_service import DatasetMetaService
from app.services.dataset_service import DatasetService
from app.schemas.dataset_meta import (
    DatasetMetaResponse,
    DatasetMetaUpdate,
    StarResponse,
    StarredByResponse,
    ContributorResponse,
    DatasetDetailResponse,
    StarsListResponse,
    ContributorsListResponse
)
from app.schemas.user import UserResponse


router = APIRouter()


@router.post("/datasets/{dataset_id}/meta", response_model=DatasetMetaResponse, status_code=status.HTTP_201_CREATED)
async def create_dataset_meta(
    dataset_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Create dataset metadata (auth required, owner only)
    
    Creates metadata for a dataset if it doesn't already exist.
    Usually happens automatically on dataset creation, but this endpoint
    allows manual creation if needed.
    """
    # Check if dataset exists and user is the owner
    dataset = await db.execute(
        select(Dataset).where(
            Dataset.id == dataset_id,
            Dataset.creator_id == current_user.id
        )
    )
    if not dataset.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dataset not found or unauthorized"
        )
    
    # Check if meta already exists
    existing_meta = await DatasetMetaService.get_meta(db, dataset_id)
    if existing_meta:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Dataset metadata already exists"
        )
    
    # Create metadata
    meta = await DatasetMetaService.create_meta(db, dataset_id)
    await db.commit()
    
    return DatasetMetaResponse.model_validate(meta)


@router.get("/datasets/{dataset_id}/meta", response_model=DatasetMetaResponse)
async def get_dataset_meta(
    dataset_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """
    Get dataset metadata (public, no auth required)
    
    Returns statistics, readme, license info, and other metadata.
    """
    meta = await DatasetMetaService.get_meta(db, dataset_id)
    
    if not meta:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dataset metadata not found"
        )
    
    return DatasetMetaResponse.model_validate(meta)


@router.put("/datasets/{dataset_id}/meta", response_model=DatasetMetaResponse)
async def update_dataset_meta(
    dataset_id: UUID,
    update_data: DatasetMetaUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Update dataset metadata (auth required, owner only)
    
    Allows updating readme, description, and license information.
    """
    # Check if dataset exists and user is the owner
    dataset = await db.execute(
        select(Dataset).where(
            Dataset.id == dataset_id,
            Dataset.creator_id == current_user.id
        )
    )
    if not dataset.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dataset not found or unauthorized"
        )
    
    meta = await DatasetMetaService.update_meta(db, dataset_id, update_data, current_user.id)
    
    if not meta:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dataset metadata not found"
        )
    
    # Build response BEFORE commit to avoid greenlet error
    response = DatasetMetaResponse(
        dataset_id=meta.dataset_id,
        stars_count=meta.stars_count,
        downloads_count=meta.downloads_count,
        views_count=meta.views_count,
        size_bytes=meta.size_bytes,
        readme=meta.readme,
        description=meta.description,
        license_type=meta.license_type,
        license_text=meta.license_text,
        last_updated_user_id=meta.last_updated_user_id,
        created_at=meta.created_at,
        updated_at=meta.updated_at
    )
    
    await db.commit()
    
    return response




@router.get("/datasets/{dataset_id}/detail", response_model=DatasetDetailResponse)
async def get_dataset_detail(
    dataset_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """
    Get complete dataset details (public, no auth required)
    
    Returns dataset info, metadata, creator, and contributors.
    Also increments the view count.
    """
    # Get dataset with creator and meta
    result = await db.execute(
        select(Dataset)
        .options(
            selectinload(Dataset.creator),
            selectinload(Dataset.meta)
        )
        .where(Dataset.id == dataset_id)
    )
    dataset = result.scalar_one_or_none()
    
    if not dataset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dataset not found"
        )
    
    # Increment view count
    await DatasetMetaService.increment_views(db, dataset_id)
    await db.commit()
    
    # Get contributors
    contributors_data, _ = await DatasetMetaService.get_contributors(db, dataset_id, limit=10)
    
    # Get entry count
    from app.models.dataset import DataEntry
    from sqlalchemy import func
    count_query = select(func.count()).where(DataEntry.dataset_id == dataset_id)
    entry_count = await db.scalar(count_query) or 0
    
    # Build response
    response_data = {
        "id": dataset.id,
        "name": dataset.name,
        "type": dataset.type,
        "description": dataset.description,
        "is_public": dataset.is_public,
        "creator_id": dataset.creator_id,
        "created_at": dataset.created_at,
        "updated_at": dataset.updated_at,
        "entry_count": entry_count,
        "creator": UserResponse.model_validate(dataset.creator) if dataset.creator else None,
        "meta": DatasetMetaResponse.model_validate(dataset.meta) if dataset.meta else None,
        "contributors": [
            ContributorResponse(
                user=UserResponse.model_validate(c.user),
                contribution_count=c.contribution_count,
                first_contribution_at=c.first_contribution_at,
                last_contribution_at=c.last_contribution_at
            ) for c in contributors_data if c.user
        ]
    }
    
    return DatasetDetailResponse(**response_data)


@router.post("/datasets/{dataset_id}/star", response_model=StarResponse)
async def star_dataset(
    dataset_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Star a dataset (auth required)
    
    Adds the dataset to user's favorites and increments star count.
    """
    # Check if dataset exists
    dataset = await DatasetService.get_by_id(db, dataset_id, include_entry_count=False)
    if not dataset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dataset not found"
        )
    
    star = await DatasetMetaService.star_dataset(db, dataset_id, current_user.id)
    
    if not star:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Dataset already starred"
        )
    
    await db.commit()
    
    return StarResponse.model_validate(star)


@router.delete("/datasets/{dataset_id}/star", status_code=status.HTTP_204_NO_CONTENT)
async def unstar_dataset(
    dataset_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Unstar a dataset (auth required)
    
    Removes the dataset from user's favorites and decrements star count.
    """
    success = await DatasetMetaService.unstar_dataset(db, dataset_id, current_user.id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Star not found"
        )
    
    await db.commit()


@router.get("/datasets/{dataset_id}/starred")
async def check_if_starred(
    dataset_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Check if the current user has starred a dataset
    
    Returns whether the current user has starred this dataset.
    """
    is_starred = await DatasetMetaService.is_starred_by(db, dataset_id, current_user.id)
    
    return {"is_starred": is_starred}


@router.get("/datasets/{dataset_id}/stars", response_model=StarsListResponse)
async def get_dataset_stars(
    dataset_id: UUID,
    offset: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """
    Get users who starred a dataset (public, no auth required)
    
    Returns paginated list of users who have starred this dataset.
    """
    stars, total = await DatasetMetaService.get_stars(db, dataset_id, offset, limit)
    
    stars_response = [
        StarredByResponse(
            user=UserResponse.model_validate(star.user),
            starred_at=star.created_at
        ) for star in stars if star.user
    ]
    
    return StarsListResponse(
        total=total,
        offset=offset,
        limit=limit,
        stars=stars_response
    )


@router.post("/datasets/{dataset_id}/download", status_code=status.HTTP_204_NO_CONTENT)
async def record_download(
    dataset_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """
    Record a dataset download (public, no auth required)
    
    Increments the download counter for analytics.
    """
    # Check if dataset exists
    dataset = await DatasetService.get_by_id(db, dataset_id, include_entry_count=False)
    if not dataset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dataset not found"
        )
    
    await DatasetMetaService.increment_downloads(db, dataset_id)
    await db.commit()


@router.get("/datasets/{dataset_id}/contributors", response_model=ContributorsListResponse)
async def get_dataset_contributors(
    dataset_id: UUID,
    offset: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """
    Get dataset contributors (public, no auth required)
    
    Returns paginated list of users who have contributed to this dataset.
    """
    contributors, total = await DatasetMetaService.get_contributors(db, dataset_id, offset, limit)
    
    contributors_response = [
        ContributorResponse(
            user=UserResponse.model_validate(c.user),
            contribution_count=c.contribution_count,
            first_contribution_at=c.first_contribution_at,
            last_contribution_at=c.last_contribution_at
        ) for c in contributors if c.user
    ]
    
    return ContributorsListResponse(
        total=total,
        offset=offset,
        limit=limit,
        contributors=contributors_response
    )
