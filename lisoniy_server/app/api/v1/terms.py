"""Terms API endpoints"""

from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.user import User
from app.core.dependencies import get_current_active_user
from app.schemas.terminology import (
    TermCreate,
    TermUpdate,
    TermResponse,
    TermDetailResponse,
    BulkTermCreate,
    BulkTermDelete,
    BulkOperationResponse,
)
from app.services.term_service import TermService


router = APIRouter()


@router.post("/", response_model=TermResponse, status_code=status.HTTP_201_CREATED)
async def create_term(
    term_data: TermCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Create a new term with definitions (requires authentication)
    
    - **keyword**: Unique term keyword
    - **category_id**: UUID of the category
    - **definitions**: List of definitions in different languages
    """
    try:
        term = await TermService.create_term(
            db=db,
            term_data=term_data,
            user_id=current_user.id
        )
        return term
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create term: {str(e)}"
        )


@router.get("/{keyword}", response_model=TermDetailResponse)
async def get_term_by_keyword(
    keyword: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Get term by keyword (public endpoint, cached)
    
    Returns the term with all definitions and category information
    """
    term = await TermService.get_by_keyword(db, keyword)
    
    if not term:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Term '{keyword}' not found"
        )
    
    return term


@router.get("/id/{term_id}", response_model=TermDetailResponse)
async def get_term_by_id(
    term_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """
    Get term by ID (public endpoint)
    
    Returns the term with all definitions and category information
    """
    term = await TermService.get_by_id(db, term_id)
    
    if not term:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Term with ID {term_id} not found"
        )
    
    return term


@router.patch("/{term_id}", response_model=TermResponse)
async def update_term(
    term_id: UUID,
    term_data: TermUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Update a term (requires authentication)
    
    Can update keyword or category
    """
    # Get existing term
    term = await TermService.get_by_id(db, term_id)
    if not term:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Term with ID {term_id} not found"
        )
    
    try:
        updated_term = await TermService.update_term(
            db=db,
            term=term,
            term_data=term_data,
            user_id=current_user.id
        )
        await db.commit()
        return updated_term
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.delete("/{term_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_term(
    term_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Soft delete a term (requires authentication)
    
    Sets is_deleted=True and records deletion metadata
    """
    # Get existing term
    term = await TermService.get_by_id(db, term_id)
    if not term:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Term with ID {term_id} not found"
        )
    
    await TermService.delete_term(
        db=db,
        term=term,
        user_id=current_user.id
    )
    
    await db.commit()
    return None


@router.post("/bulk", response_model=BulkOperationResponse)
async def bulk_create_terms(
    bulk_data: BulkTermCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Create multiple terms at once (requires authentication)
    
    Maximum 100 terms per request
    Returns success/failure details for each term
    """
    results = await TermService.bulk_create_terms(
        db=db,
        bulk_data=bulk_data,
        user_id=current_user.id
    )
    
    successful = sum(1 for r in results if r.success)
    failed = len(results) - successful
    
    return BulkOperationResponse(
        total=len(results),
        successful=successful,
        failed=failed,
        results=results
    )


@router.delete("/bulk", response_model=BulkOperationResponse)
async def bulk_delete_terms(
    bulk_data: BulkTermDelete,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Delete multiple terms at once (requires authentication)
    
    Maximum 100 terms per request
    Returns success/failure details for each term
    """
    results = await TermService.bulk_delete_terms(
        db=db,
        term_ids=bulk_data.term_ids,
        user_id=current_user.id
    )
    
    successful = sum(1 for r in results if r.success)
    failed = len(results) - successful
    
    return BulkOperationResponse(
        total=len(results),
        successful=successful,
        failed=failed,
        results=results
    )
