"""Admin API endpoints (RBAC protected)"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserResponse, AdminUserUpdate
from app.services.user_service import UserService
from app.core.dependencies import get_current_admin_user

router = APIRouter()


@router.get("/users", response_model=List[UserResponse])
async def get_all_users(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of records"),
    current_admin: User = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db)
) -> List[UserResponse]:
    """
    Get all users (Admin only)
    
    - **skip**: Pagination offset
    - **limit**: Number of users to return
    
    Requires admin role
    """
    users = await UserService.get_all_users(db, skip=skip, limit=limit)
    return [UserResponse.model_validate(user) for user in users]


@router.get("/users/{user_id}", response_model=UserResponse)
async def get_user_by_id(
    user_id: int,
    current_admin: User = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db)
) -> UserResponse:
    """
    Get specific user by ID (Admin only)
    
    - **user_id**: User ID
    
    Requires admin role
    """
    user = await UserService.get_user_by_id(db, user_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserResponse.model_validate(user)


@router.put("/users/{user_id}", response_model=UserResponse)
async def admin_update_user(
    user_id: int,
    user_data: AdminUserUpdate,
    current_admin: User = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db)
) -> UserResponse:
    """
    Update any user (Admin only)
    
    - **user_id**: User ID to update
    - **user_data**: Fields to update (email, role, is_active, etc.)
    
    Requires admin role
    """
    updated_user = await UserService.admin_update_user(db, user_id, user_data)
    
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserResponse.model_validate(updated_user)


@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def admin_delete_user(
    user_id: int,
    current_admin: User = Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db)
) -> None:
    """
    Delete any user (Admin only)
    
    - **user_id**: User ID to delete
    
    Requires admin role
    """
    # Prevent admin from deleting themselves
    if user_id == current_admin.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete your own account via admin endpoint"
        )
    
    success = await UserService.delete_user(db, user_id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
