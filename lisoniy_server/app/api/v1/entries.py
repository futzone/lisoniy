"""Data entry management API endpoints"""

from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.core.dependencies import get_current_active_user
from app.models.user import User
from app.schemas.dataset import (
    DataEntryCreate,
    DataEntryUpdate,
    DataEntryResponse,
    DataEntrySearchResponse,
    BulkDataEntryCreate,
    BulkDeleteRequest,
    BulkOperationResult
)
from app.services.data_entry_service import DataEntryService


router = APIRouter(prefix="/entries", tags=["entries"])


@router.post("/", response_model=DataEntryResponse, status_code=status.HTTP_201_CREATED)
async def create_entry(
    entry_data: DataEntryCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Create a single data entry (requires authentication)
    
    - **dataset_id**: ID of the dataset this entry belongs to
    - **content**: Entry content (polymorphic JSON structure)
    - **metadata**: Optional metadata (tags, source, etc.)
    
    Duplicates are detected using SHA256 hash of dataset_id + content.
    """
    try:
        entry = await DataEntryService.create_entry(db, entry_data, current_user.id)
        await db.commit()
        return DataEntryResponse.model_validate(entry)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to create entry: {str(e)}"
        )


@router.post("/bulk", response_model=BulkOperationResult, status_code=status.HTTP_201_CREATED)
async def bulk_create_entries(
    bulk_data: BulkDataEntryCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Bulk create data entries (requires authentication, max 1000 entries)
    
    Uses PostgreSQL's ON CONFLICT DO NOTHING for efficient deduplication.
    Duplicates are automatically skipped.
    
    - **dataset_id**: ID of the dataset
    - **entries**: List of content objects (max 1000)
    
    Returns:
    - **total**: Total entries in request
    - **created**: Successfully created entries
    - **skipped**: Duplicate entries skipped
    - **failed**: Failed entries
    - **errors**: List of error messages
    """
    try:
        result = await DataEntryService.bulk_create_entries(
            db=db,
            dataset_id=bulk_data.dataset_id,
            entries_data=bulk_data.entries,
            user_id=current_user.id
        )
        await db.commit()
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Bulk creation failed: {str(e)}"
        )


@router.get("/", response_model=DataEntrySearchResponse)
async def search_entries(
    dataset_id: UUID = Query(None, description="Filter by dataset ID"),
    dataset_type: str = Query(None, description="Filter by dataset type"),
    offset: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """
    Search and filter data entries (no auth required, cached 300s)
    
    Returns paginated list of entries. Results are cached in Redis for 5 minutes.
    
    Query parameters:
    - **dataset_id**: Filter by specific dataset
    - **dataset_type**: Filter by dataset type
    - **offset**: Pagination offset
    - **limit**: Pagination limit (max 100)
    """
    entries, total = await DataEntryService.search_entries(
        db=db,
        dataset_id=dataset_id,
        dataset_type=dataset_type,
        offset=offset,
        limit=limit
    )
    
    # Convert to dicts manually to avoid relationship loading
    entries_data = [
        {
            "id": entry.id,
            "dataset_id": entry.dataset_id,
            "content": entry.content,
            "entry_metadata": entry.entry_metadata,
            "hash_key": entry.hash_key,
            "creator_id": entry.creator_id,
            "created_at": entry.created_at,
            "updated_at": entry.updated_at
        }
        for entry in entries
    ]
    
    return DataEntrySearchResponse(
        total=total,
        offset=offset,
        limit=limit,
        entries=[DataEntryResponse(**data) for data in entries_data]
    )


@router.get("/{entry_id}", response_model=DataEntryResponse)
async def get_entry(
    entry_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """
    Get single entry by ID (no auth required)
    
    Returns entry details.
    """
    entry = await DataEntryService.get_by_id(db, entry_id)
    
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Entry not found"
        )
    
    return DataEntryResponse.model_validate(entry)


@router.patch("/{entry_id}", response_model=DataEntryResponse)
async def update_entry(
    entry_id: UUID,
    update_data: DataEntryUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Update data entry (requires authentication and ownership)
    
    Only the entry creator can update it.
    If content is updated, hash is regenerated.
    """
    entry = await DataEntryService.update_entry(
        db=db,
        entry_id=entry_id,
        update_data=update_data,
        user_id=current_user.id
    )
    
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Entry not found or unauthorized"
        )
    
    await db.commit()
    return DataEntryResponse.model_validate(entry)


@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_entry(
    entry_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Delete single entry (requires authentication and ownership)
    
    Only the entry creator can delete it.
    """
    deleted = await DataEntryService.delete_entry(
        db=db,
        entry_id=entry_id,
        user_id=current_user.id
    )
    
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Entry not found or unauthorized"
        )
    
    await db.commit()


@router.delete("/bulk", response_model=BulkOperationResult)
async def bulk_delete_entries(
    delete_data: BulkDeleteRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Bulk delete data entries (requires authentication, max 1000 entries)
    
    Only deletes entries owned by the current user.
    
    - **entry_ids**: List of entry IDs to delete (max 1000)
    
    Returns:
    - **total**: Total entries in request
    - **deleted**: Successfully deleted entries
    - **failed**: Entries not found or unauthorized
    - **errors**: List of error messages
    """
    try:
        result = await DataEntryService.bulk_delete_entries(
            db=db,
            entry_ids=delete_data.entry_ids,
            user_id=current_user.id
        )
        await db.commit()
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Bulk deletion failed: {str(e)}"
        )
