"""Authentication API endpoints"""

from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    VerifyEmailRequest,
    RequestPasswordResetRequest,
    ResetPasswordRequest,
)
from app.schemas.token import TokenResponse, RefreshTokenRequest, AccessTokenResponse
from app.schemas.user import UserResponse
from app.services.auth_service import AuthService
from app.services.redis_manager import redis_manager
from app.tasks.email_tasks import send_welcome_email

router = APIRouter()


@router.post("/register", response_model=Dict[str, Any], status_code=status.HTTP_201_CREATED)
async def register(
    user_data: RegisterRequest,
    request: Request,
    db: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    """
    Register a new user
    
    - **email**: Valid email address
    - **password**: Password (min 8 characters)
    - **full_name**: User's full name
    - **phone**: Optional phone number
    
    Returns user info and sends verification email with OTP
    """
    # Rate limiting by IP
    client_ip = request.client.host
    is_allowed = await redis_manager.check_rate_limit(f"register:{client_ip}")
    
    if not is_allowed:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many registration attempts. Please try again later."
        )
    
    return await AuthService.register_user(db, user_data)


@router.post("/verify-email", response_model=UserResponse)
async def verify_email(
    verify_data: VerifyEmailRequest,
    db: AsyncSession = Depends(get_db)
) -> UserResponse:
    """
    Verify user email with OTP code
    
    - **email**: User email
    - **otp**: 6-digit OTP code
    
    Returns verified user info
    """
    user = await AuthService.verify_email(db, verify_data.email, verify_data.otp)
    
    # Send welcome email (background task)
    send_welcome_email.delay(user.email, user.full_name or "User")
    
    return UserResponse.model_validate(user)


@router.post("/login", response_model=TokenResponse)
async def login(
    login_data: LoginRequest,
    request: Request,
    db: AsyncSession = Depends(get_db)
) -> TokenResponse:
    """
    Login with email and password
    
    - **email**: User email
    - **password**: User password
    
    Returns access and refresh tokens
    """
    # Rate limiting by email
    is_allowed = await redis_manager.check_rate_limit(f"login:{login_data.email}")
    
    if not is_allowed:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many login attempts. Please try again later."
        )
    
    return await AuthService.login(db, login_data)


@router.post("/refresh", response_model=AccessTokenResponse)
async def refresh_token(
    refresh_data: RefreshTokenRequest,
    db: AsyncSession = Depends(get_db)
) -> AccessTokenResponse:
    """
    Refresh access token using refresh token
    
    - **refresh_token**: Valid refresh token
    
    Returns new access token
    """
    access_token = await AuthService.refresh_access_token(db, refresh_data.refresh_token)
    
    return AccessTokenResponse(access_token=access_token, token_type="bearer")


@router.post("/request-password-reset", response_model=Dict[str, str])
async def request_password_reset(
    reset_data: RequestPasswordResetRequest,
    request: Request,
    db: AsyncSession = Depends(get_db)
) -> Dict[str, str]:
    """
    Request password reset
    
    - **email**: User email
    
    Sends password reset email if user exists
    """
    # Rate limiting
    client_ip = request.client.host
    is_allowed = await redis_manager.check_rate_limit(f"password_reset:{client_ip}")
    
    if not is_allowed:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many password reset requests. Please try again later."
        )
    
    return await AuthService.request_password_reset(db, reset_data.email)


@router.post("/reset-password", response_model=Dict[str, str])
async def reset_password(
    reset_data: ResetPasswordRequest,
    db: AsyncSession = Depends(get_db)
) -> Dict[str, str]:
    """
    Reset password using token
    
    - **token**: Password reset token
    - **new_password**: New password (min 8 characters)
    
    Returns success message
    """
    return await AuthService.reset_password(db, reset_data.token, reset_data.new_password)
