"""Authentication-related Pydantic schemas"""

from pydantic import BaseModel, EmailStr, Field


class LoginRequest(BaseModel):
    """Schema for login request"""
    email: EmailStr
    password: str


class RegisterRequest(BaseModel):
    """Schema for user registration"""
    email: EmailStr
    password: str = Field(..., min_length=8, description="Password must be at least 8 characters")
    full_name: str = Field(..., min_length=2)
    phone: str | None = None


class VerifyEmailRequest(BaseModel):
    """Schema for email verification with OTP"""
    email: EmailStr
    otp: str = Field(..., min_length=6, max_length=6, description="6-digit OTP code")


class RequestPasswordResetRequest(BaseModel):
    """Schema for password reset request"""
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    """Schema for password reset with token"""
    token: str
    new_password: str = Field(..., min_length=8, description="Password must be at least 8 characters")


class ChangePasswordRequest(BaseModel):
    """Schema for changing password (authenticated user)"""
    old_password: str
    new_password: str = Field(..., min_length=8, description="Password must be at least 8 characters")
