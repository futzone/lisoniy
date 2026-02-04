"""Dataset management API endpoints"""

from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.core.dependencies import get_current_active_user
from app.models.user import User
from app.schemas.dataset import (
    DatasetCreate,
    DatasetUpdate,
    DatasetResponse,
    DatasetListResponse
)
from app.services.dataset_service import DatasetService


router = APIRouter(prefix="/datasets", tags=["datasets"])


@router.post("/", response_model=DatasetResponse, status_code=status.HTTP_201_CREATED)
async def create_dataset(
    dataset_data: DatasetCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Create a new dataset (requires authentication)
    
    - **name**: Dataset name
    - **type**: Dataset type (instruction, parallel, ner, legal_qa, etc.)
    - **description**: Optional description
    - **is_public**: Whether the dataset is publicly visible (default: false)
    """
    dataset = await DatasetService.create_dataset(db, dataset_data, current_user.id)
    await db.commit()
    
    # Add entry count
    dataset.entry_count = 0
    
    return DatasetResponse.model_validate(dataset)


@router.get("/me", response_model=DatasetListResponse)
async def get_my_datasets(
    offset: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get datasets created by the current user (requires authentication)
    
    Returns paginated list of user's datasets with entry counts.
    """
    datasets, total = await DatasetService.get_user_datasets(
        db=db,
        user_id=current_user.id,
        offset=offset,
        limit=limit
    )
    
    return DatasetListResponse(
        total=total,
        offset=offset,
        limit=limit,
        datasets=[DatasetResponse.model_validate(d) for d in datasets]
    )


@router.get("/public", response_model=DatasetListResponse)
async def get_public_datasets(
    dataset_type: str = Query(None, description="Filter by dataset type"),
    sort_by: str = Query("new", description="Sort by: new, top, largest"),
    offset: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """
    Get public datasets with sorting and filtering options.
    """
    datasets, total = await DatasetService.get_public_datasets(
        db=db,
        dataset_type=dataset_type,
        sort_by=sort_by,
        offset=offset,
        limit=limit
    )
    
    return DatasetListResponse(
        total=total,
        offset=offset,
        limit=limit,
        datasets=[DatasetResponse.model_validate(d) for d in datasets]
    )


@router.get("/{dataset_id}/download")
async def download_dataset(
    dataset_id: UUID,
    format: str = Query("json", regex="^(json|csv)$"),
    db: AsyncSession = Depends(get_db)
):
    """
    Download dataset entries in JSON or CSV format
    """
    dataset = await DatasetService.get_by_id(db, dataset_id)
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    
    # Increment download count
    from app.services.dataset_meta_service import DatasetMetaService
    await DatasetMetaService.increment_downloads(db, dataset_id)
    await db.commit()
    
    from app.services.data_entry_service import DataEntryService
    from fastapi.responses import StreamingResponse
    import io
    import json
    import csv

    # Fetch all entries (limit=None or a large number)
    entries, _ = await DataEntryService.search_entries(db, dataset_id=dataset_id, limit=50000)
    
    filename = f"{dataset.name.lower().replace(' ', '_')}_{dataset_id}.{format}"
    
    if format == "json":
        data = [e.content for e in entries]
        buffer = io.StringIO()
        json.dump(data, buffer, ensure_ascii=False, indent=2)
        buffer.seek(0)
        return StreamingResponse(
            io.BytesIO(buffer.getvalue().encode('utf-8')),
            media_type="application/json",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    else:
        # CSV Format
        buffer = io.StringIO()
        if entries:
            # Get headers from first entry's content keys
            headers = list(entries[0].content.keys()) if isinstance(entries[0].content, dict) else ["content"]
            writer = csv.DictWriter(buffer, fieldnames=headers)
            writer.writeheader()
            for e in entries:
                if isinstance(e.content, dict):
                    writer.writerow(e.content)
                else:
                    writer.writerow({"content": str(e.content)})
        
        buffer.seek(0)
        return StreamingResponse(
            io.BytesIO(buffer.getvalue().encode('utf-8')),
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )


@router.get("/{dataset_id}", response_model=DatasetResponse)
async def get_dataset(
    dataset_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """
    Get dataset by ID (no auth required for public datasets)
    
    Returns dataset details with entry count.
    """
    # Fetch dataset first to see if it exists
    dataset = await DatasetService.get_by_id(db, dataset_id, include_entry_count=True, include_meta=True)
    
    if not dataset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dataset not found"
        )
    
    # Increment view count
    try:
        from app.services.dataset_meta_service import DatasetMetaService
        await DatasetMetaService.increment_views(db, dataset_id)
        await db.commit()
        
        # Re-fetch to get updated view count and meta object if it was just created
        dataset = await DatasetService.get_by_id(db, dataset_id, include_entry_count=True, include_meta=True)
    except Exception as e:
        import logging
        logging.error(f"Failed to increment views for dataset {dataset_id}: {e}")
        # Don't fail the request if stats update fails
    
    return DatasetResponse.model_validate(dataset)


@router.patch("/{dataset_id}", response_model=DatasetResponse)
async def update_dataset(
    dataset_id: UUID,
    update_data: DatasetUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Update dataset (requires authentication and ownership)
    
    Only the dataset creator can update it.
    """
    dataset = await DatasetService.update_dataset(
        db=db,
        dataset_id=dataset_id,
        update_data=update_data,
        user_id=current_user.id
    )
    
    if not dataset:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dataset not found or unauthorized"
        )
    
    await db.commit()
    
    # Get entry count
    from app.models.dataset import DataEntry
    from sqlalchemy import select, func
    count_query = select(func.count()).where(DataEntry.dataset_id == dataset_id)
    count = await db.scalar(count_query)
    dataset.entry_count = count
    
    return DatasetResponse.model_validate(dataset)


@router.delete("/{dataset_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_dataset(
    dataset_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Delete dataset (requires authentication and ownership)
    
    This will cascade delete all entries in the dataset.
    Only the dataset creator can delete it.
    """
    deleted = await DatasetService.delete_dataset(
        db=db,
        dataset_id=dataset_id,
        user_id=current_user.id
    )
    
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Dataset not found or unauthorized"
        )
    
    await db.commit()
    
    # Invalidate cache
    from app.services.data_entry_service import DataEntryService
    await DataEntryService.invalidate_dataset_cache(dataset_id)


@router.get("/search/all", response_model=DatasetListResponse)
async def search_datasets(
    q: str = Query(None, description="Search query (name/description)"),
    dataset_type: str = Query(None, description="Filter by dataset type"),
    offset: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Search datasets with filters (requires authentication)
    
    Returns user's datasets and public datasets matching the criteria.
    """
    datasets, total = await DatasetService.search_datasets(
        db=db,
        query_text=q,
        dataset_type=dataset_type,
        user_id=current_user.id,
        include_public=True,
        offset=offset,
        limit=limit
    )
    
    return DatasetListResponse(
        total=total,
        offset=offset,
        limit=limit,
        datasets=[DatasetResponse.model_validate(d) for d in datasets]
    )
