"""User-related Pydantic schemas (Pydantic V2)"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, ConfigDict

from app.models.user import UserRole


# Base User Schema
class UserBase(BaseModel):
    """Base user schema with common fields"""
    email: EmailStr
    full_name: Optional[str] = None
    phone: Optional[str] = None


# User Creation Schema
class UserCreate(UserBase):
    """Schema for user registration"""
    password: str = Field(..., min_length=8, description="Password must be at least 8 characters")


# User Update Schema
class UserUpdate(BaseModel):
    """Schema for updating user profile"""
    full_name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None


# User Response Schema
class UserResponse(UserBase):
    """Schema for user response (public data)"""
    id: int
    role: UserRole
    is_active: bool
    is_verified: bool
    last_login: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


# User In Database Schema
class UserInDB(UserResponse):
    """Schema for user in database (includes sensitive data)"""
    hashed_password: str
    
    model_config = ConfigDict(from_attributes=True)


# Admin User Update Schema
class AdminUserUpdate(BaseModel):
    """Schema for admin to update any user"""
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    phone: Optional[str] = None
    role: Optional[UserRole] = None
    is_active: Optional[bool] = None
    is_verified: Optional[bool] = None
