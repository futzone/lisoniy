"""Authentication service"""

from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status
import secrets

from app.models.user import User, RefreshToken
from app.schemas.auth import RegisterRequest, LoginRequest
from app.schemas.token import TokenResponse
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    create_refresh_token,
    decode_token,
    verify_token_type,
)
from app.core.config import settings
from app.services.user_service import UserService
from app.services.redis_manager import redis_manager


class AuthService:
    """Service for authentication operations"""
    
    @staticmethod
    async def register_user(
        db: AsyncSession,
        user_data: RegisterRequest
    ) -> Dict[str, Any]:
        """
        Register a new user and send verification email
        
        Args:
            db: Database session
            user_data: Registration data
            
        Returns:
            Dictionary with user info and OTP (for testing)
        """
        # Create user
        from app.schemas.user import UserCreate
        user_create = UserCreate(
            email=user_data.email,
            password=user_data.password,
            full_name=user_data.full_name,
            phone=user_data.phone,
        )
        
        user = await UserService.create_user(db, user_create)
        
        # Generate and store OTP
        otp = await redis_manager.generate_otp(user.email)
        
        # Send verification email (via Celery task)
        from app.tasks.email_tasks import send_verification_email
        send_verification_email.delay(user.email, user.full_name or "User", otp)
        
        return {
            "user_id": user.id,
            "email": user.email,
            "message": "User registered successfully. Please check your email for verification code.",
            "otp": otp if settings.DEBUG else None,  # Only return OTP in debug mode
        }
    
    @staticmethod
    async def verify_email(db: AsyncSession, email: str, otp: str) -> User:
        """
        Verify user email with OTP
        
        Args:
            db: Database session
            email: User email
            otp: OTP code
            
        Returns:
            Verified user
            
        Raises:
            HTTPException: If OTP is invalid or user not found
        """
        # Verify OTP
        is_valid = await redis_manager.verify_otp(email, otp)
        if not is_valid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired OTP"
            )
        
        # Get user
        user = await UserService.get_user_by_email(db, email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Mark as verified
        user = await UserService.verify_user_email(db, user.id)
        
        return user
    
    @staticmethod
    async def login(db: AsyncSession, login_data: LoginRequest) -> TokenResponse:
        """
        Authenticate user and return tokens
        
        Args:
            db: Database session
            login_data: Login credentials
            
        Returns:
            Access and refresh tokens
            
        Raises:
            HTTPException: If credentials are invalid
        """
        # Get user
        user = await UserService.get_user_by_email(db, login_data.email)
        
        if not user or not verify_password(login_data.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is deactivated"
            )
        
        # Update last login
        await UserService.update_last_login(db, user.id)
        
        # Create tokens
        access_token = create_access_token(data={"sub": str(user.id)})
        refresh_token = create_refresh_token(data={"sub": str(user.id)})
        
        # Store refresh token in Redis
        await redis_manager.store_refresh_token(
            user.id,
            refresh_token,
            settings.REFRESH_TOKEN_EXPIRE_DAYS
        )
        
        # Also store in database for persistence
        expires_at = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        db_refresh_token = RefreshToken(
            token=refresh_token,
            user_id=user.id,
            expires_at=expires_at,
            is_revoked=False,
        )
        db.add(db_refresh_token)
        await db.commit()
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer"
        )
    
    @staticmethod
    async def refresh_access_token(db: AsyncSession, refresh_token: str) -> str:
        """
        Generate new access token from refresh token
        
        Args:
            db: Database session
            refresh_token: Refresh token
            
        Returns:
            New access token
            
        Raises:
            HTTPException: If refresh token is invalid
        """
        # Decode refresh token
        payload = decode_token(refresh_token)
        verify_token_type(payload, "refresh")
        
        user_id = int(payload.get("sub"))
        
        # Verify token exists in Redis (for quick check)
        is_valid_in_redis = await redis_manager.verify_refresh_token(user_id, refresh_token)
        
        # Also check database
        result = await db.execute(
            select(RefreshToken).where(
                RefreshToken.token == refresh_token,
                RefreshToken.user_id == user_id,
                RefreshToken.is_revoked == False,
            )
        )
        db_token = result.scalar_one_or_none()
        
        if not is_valid_in_redis or not db_token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or revoked refresh token"
            )
        
        # Check expiration
        if db_token.expires_at < datetime.utcnow():
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token expired"
            )
        
        # Create new access token
        access_token = create_access_token(data={"sub": str(user_id)})
        
        return access_token
    
    @staticmethod
    async def request_password_reset(db: AsyncSession, email: str) -> Dict[str, str]:
        """
        Request password reset and send email
        
        Args:
            db: Database session
            email: User email
            
        Returns:
            Message and reset token (in debug mode)
        """
        user = await UserService.get_user_by_email(db, email)
        
        # Don't reveal if user exists or not
        if not user:
            return {"message": "If the email exists, a password reset link has been sent."}
        
        # Generate reset token
        reset_token = secrets.token_urlsafe(32)
        
        # Store in Redis
        await redis_manager.store_password_reset_token(email, reset_token)
        
        # Send email (via Celery)
        from app.tasks.email_tasks import send_password_reset_email
        send_password_reset_email.delay(
            email,
            user.full_name or "User",
            reset_token
        )
        
        return {
            "message": "If the email exists, a password reset link has been sent.",
            "reset_token": reset_token if settings.DEBUG else None,
        }
    
    @staticmethod
    async def reset_password(
        db: AsyncSession,
        token: str,
        new_password: str
    ) -> Dict[str, str]:
        """
        Reset password using token
        
        Args:
            db: Database session
            token: Reset token
            new_password: New password
            
        Returns:
            Success message
            
        Raises:
            HTTPException: If token is invalid
        """
        # Verify token and get email
        email = await redis_manager.verify_password_reset_token(token)
        
        if not email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired reset token"
            )
        
        # Get user
        user = await UserService.get_user_by_email(db, email)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Update password
        user.hashed_password = get_password_hash(new_password)
        await db.commit()
        
        # Revoke all refresh tokens for security
        await redis_manager.revoke_all_user_tokens(user.id)
        
        return {"message": "Password reset successfully"}
