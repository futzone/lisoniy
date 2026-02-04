"""Common FastAPI dependencies"""

from typing import Optional
from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.security import oauth2_scheme, oauth2_scheme_optional, decode_token, verify_token_type
from app.db.session import get_db
from app.models.user import User, UserRole


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
) -> User:
    """
    Get current authenticated user from JWT token
    
    Args:
        token: JWT access token
        db: Database session
        
    Returns:
        Current authenticated user
        
    Raises:
        HTTPException: If user not found or token invalid
    """
    # Decode token
    payload = decode_token(token)
    
    # Verify it's an access token
    verify_token_type(payload, "access")
    
    # Extract user ID
    user_id: Optional[int] = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Get user from database
    result = await db.execute(select(User).where(User.id == int(user_id)))
    user = result.scalar_one_or_none()
    
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user"
        )
    
    return user


async def get_current_user_optional(
    token: Optional[str] = Depends(oauth2_scheme_optional),
    db: AsyncSession = Depends(get_db)
) -> Optional[User]:
    """
    Get current user from JWT token if provided, but don't fail if missing/invalid
    """
    if not token:
        return None
    try:
        payload = decode_token(token)
        verify_token_type(payload, "access")
        user_id: Optional[int] = payload.get("sub")
        if user_id is None:
            return None
        
        result = await db.execute(select(User).where(User.id == int(user_id)))
        user = result.scalar_one_or_none()
        return user
    except Exception:
        return None


async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Get current active user (must be verified)
    
    Args:
        current_user: Current authenticated user
        
    Returns:
        Current active user
        
    Raises:
        HTTPException: If user is not verified
    """
    if not current_user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email not verified. Please verify your email first."
        )
    return current_user


async def get_current_admin_user(
    current_user: User = Depends(get_current_active_user)
) -> User:
    """
    Get current admin user (role-based access control)
    
    Args:
        current_user: Current authenticated user
        
    Returns:
        Current admin user
        
    Raises:
        HTTPException: If user is not an admin
    """
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions. Admin role required."
        )
    return current_user
