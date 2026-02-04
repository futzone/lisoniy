"""User Meta Pydantic schemas"""

from typing import Optional, Any
from datetime import datetime
from pydantic import BaseModel, HttpUrl, Field
from app.schemas.user import UserResponse

class UserMetaBase(BaseModel):
    """Base schema for user meta data"""
    nickname: Optional[str] = Field(None, max_length=50)
    address: Optional[str] = Field(None, max_length=255)
    github_url: Optional[str] = Field(None, max_length=255)
    telegram_url: Optional[str] = Field(None, max_length=255)
    website_url: Optional[str] = Field(None, max_length=255)
    education: Optional[str] = Field(None, max_length=255)
    bio: Optional[str] = None
    avatar_image: Optional[str] = Field(None, max_length=500)

class UserMetaUpdate(UserMetaBase):
    """Schema for updating user meta"""
    pass

class UserMetaResponse(UserMetaBase):
    """Detailed user profile response with calculated stats"""
    username: Optional[str] = Field(None, alias="nickname") # Use nickname as username if present
    
    # Calculated stats
    articles: int = 0
    discussions: int = 0
    datasets: int = 0
    terms: int = 0
    entries: int = 0
    stars: int = 0
    likes: int = 0
    bonus: int = 0
    rank: int = 0
    ball: int = 0
    
    joined: datetime
    last_activity: Optional[datetime] = None
    
    # Nested user info
    user: UserResponse

    class Config:
        from_attributes = True
        populate_by_name = True

class UserRankingResponse(BaseModel):
    """User ranking item response"""
    id: int
    full_name: str
    username: Optional[str] = None
    avatar_image: Optional[str] = None
    ball: int
    rank: int
    joined: datetime
