"""Categories API endpoints"""

import json
from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.user import User
from app.core.dependencies import get_current_active_user, get_current_admin_user
from app.schemas.terminology import (
    CategoryCreate,
    CategoryUpdate,
    CategoryResponse,
    TermResponse,
)
from app.services.category_service import CategoryService
from app.services.redis_manager import redis_manager


router = APIRouter()


@router.get("/", response_model=List[CategoryResponse])
async def get_all_categories(
    db: AsyncSession = Depends(get_db)
):
    """
    Get all categories (public endpoint, cached)
    
    Returns list of all categories ordered by name
    """
    cache_key = "categories:all"
    cached = await redis_manager.get_value(cache_key)
    
    if cached:
        try:
            return json.loads(cached)
        except (json.JSONDecodeError, TypeError) as e:
            # If cached data is corrupted, delete it and fetch fresh data
            await redis_manager.delete_key(cache_key)
    
    categories = await CategoryService.get_all(db)
    categories_response = [CategoryResponse.model_validate(cat) for cat in categories]
    
    await redis_manager.set_value(cache_key, categories_response, expire=7200)
    
    return categories_response


@router.get("/{slug}", response_model=CategoryResponse)
async def get_category_by_slug(
    slug: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Get category by slug (public endpoint)
    """
    category = await CategoryService.get_by_slug(db, slug)
    
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category with slug '{slug}' not found"
        )
    
    return category


@router.get("/{slug}/terms", response_model=dict)
async def get_category_terms(
    slug: str,
    offset: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db)
):
    """
    Get terms in a category (public endpoint, cached)
    
    Returns paginated list of terms in the specified category
    """
    cache_key = f"category:{slug}:terms:{offset}:{limit}"
    cached = await redis_manager.get_value(cache_key)
    
    if cached:
        try:
            return json.loads(cached)
        except (json.JSONDecodeError, TypeError) as e:
            # If cached data is corrupted, delete it and fetch fresh data
            await redis_manager.delete_key(cache_key)

    category = await CategoryService.get_by_slug(db, slug)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category with slug '{slug}' not found"
        )
    
    terms, total = await CategoryService.get_category_terms(
        db=db,
        category_id=category.id,
        offset=offset,
        limit=limit
    )
    
    response_data = {
        "category": CategoryResponse.model_validate(category),
        "total": total,
        "offset": offset,
        "limit": limit,
        "terms": [TermResponse.model_validate(term) for term in terms]
    }

    await redis_manager.set_value(cache_key, response_data, expire=3600)
    
    return response_data


@router.post("/", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(
    category_data: CategoryCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Create a new category (requires admin authentication)
    
    - **slug**: URL-friendly identifier (lowercase, alphanumeric, hyphens)
    - **name**: Display name
    - **description**: Optional description
    """
    try:
        category = await CategoryService.create_category(db, category_data)
        await db.commit()
        
        # Invalidate cache
        await redis_manager.delete_key("categories:all")
        
        return category
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e)
        )


@router.patch("/{category_id}", response_model=CategoryResponse)
async def update_category(
    category_id: UUID,
    category_data: CategoryUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Update a category (requires admin authentication)
    """
    category = await CategoryService.get_by_id(db, category_id)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category with ID {category_id} not found"
        )
    
    updated_category = await CategoryService.update_category(
        db=db,
        category=category,
        category_data=category_data
    )
    await db.commit()
    
    # Invalidate cache
    await redis_manager.delete_key("categories:all")
    
    return updated_category


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(
    category_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Delete a category (requires admin authentication)
    
    WARNING: This will cascade delete all terms in this category!
    """
    category = await CategoryService.get_by_id(db, category_id)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Category with ID {category_id} not found"
        )
    
    await CategoryService.delete_category(db, category)
    await db.commit()
    
    # Invalidate cache
    await redis_manager.delete_key("categories:all")
    
    return None
