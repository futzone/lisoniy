"""Pydantic schemas for dataset metadata and interactions"""

from datetime import datetime
from typing import Optional, List
from uuid import UUID

from pydantic import BaseModel, Field

from app.schemas.user import UserResponse


# ==================== DatasetMeta Schemas ====================

class DatasetMetaResponse(BaseModel):
    """Schema for dataset metadata response"""
    dataset_id: UUID
    stars_count: int = 0
    downloads_count: int = 0
    views_count: int = 0
    size_bytes: int = 0
    readme: Optional[str] = None
    description: Optional[str] = None
    license_type: Optional[str] = None
    license_text: Optional[str] = None
    last_updated_user_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    
    model_config = {"from_attributes": True}


class DatasetMetaUpdate(BaseModel):
    """Schema for updating dataset metadata"""
    readme: Optional[str] = Field(None, description="Markdown README content")
    description: Optional[str] = Field(None, description="Extended description")
    license_type: Optional[str] = Field(None, max_length=100, description="License type (e.g., MIT, Apache-2.0)")
    license_text: Optional[str] = Field(None, description="Full license text")


# ==================== Star Schemas ====================

class StarResponse(BaseModel):
    """Schema for star action response"""
    dataset_id: UUID
    user_id: int
    created_at: datetime
    
    model_config = {"from_attributes": True}


class StarredByResponse(BaseModel):
    """Schema for users who starred a dataset"""
    user: UserResponse
    starred_at: datetime


# ==================== Contributor Schemas ====================

class ContributorResponse(BaseModel):
    """Schema for dataset contributors"""
    user: UserResponse
    contribution_count: int
    first_contribution_at: datetime
    last_contribution_at: datetime


# ==================== Dataset Detail Schemas ====================

class DatasetDetailResponse(BaseModel):
    """Schema for full dataset details including meta, creator, and contributors"""
    # Dataset fields
    id: UUID
    name: str
    type: str
    description: Optional[str]
    is_public: bool
    creator_id: int
    created_at: datetime
    updated_at: datetime
    entry_count: int = 0
    
    # Related data
    creator: Optional[UserResponse] = None
    meta: Optional[DatasetMetaResponse] = None
    contributors: List[ContributorResponse] = Field(default_factory=list)
    
    model_config = {"from_attributes": True}


# ==================== Pagination Schemas ====================

class StarsListResponse(BaseModel):
    """Schema for paginated stars list"""
    total: int
    offset: int
    limit: int
    stars: List[StarredByResponse]


class ContributorsListResponse(BaseModel):
    """Schema for paginated contributors list"""
    total: int
    offset: int
    limit: int
    contributors: List[ContributorResponse]
