"""Terminology/Dictionary Pydantic schemas"""

from datetime import datetime
from typing import Optional, List
from uuid import UUID

from pydantic import BaseModel, Field, field_validator


# ============================================================================
# Category Schemas
# ============================================================================

class CategoryBase(BaseModel):
    """Base category schema"""
    slug: str = Field(..., min_length=1, max_length=100, pattern=r'^[a-z0-9-]+$')
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None


class CategoryCreate(CategoryBase):
    """Schema for creating a category"""
    pass


class CategoryUpdate(BaseModel):
    """Schema for updating a category"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None


class CategoryResponse(CategoryBase):
    """Schema for category response"""
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# ============================================================================
# Definition Schemas
# ============================================================================

class DefinitionBase(BaseModel):
    """Base definition schema"""
    language: str = Field(..., min_length=2, max_length=2, pattern=r'^[a-z]{2}$')
    text: str = Field(..., min_length=1)
    example: Optional[str] = None


class DefinitionCreate(DefinitionBase):
    """Schema for creating a definition"""
    pass


class DefinitionUpdate(BaseModel):
    """Schema for updating a definition"""
    text: Optional[str] = Field(None, min_length=1)
    example: Optional[str] = None
    is_approved: Optional[bool] = None


class DefinitionResponse(DefinitionBase):
    """Schema for definition response"""
    id: UUID
    term_id: UUID
    is_approved: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# ============================================================================
# Term Schemas
# ============================================================================

class TermBase(BaseModel):
    """Base term schema"""
    keyword: str = Field(..., min_length=1, max_length=255)


class TermCreate(TermBase):
    """Schema for creating a term"""
    category_id: UUID
    definitions: List[DefinitionCreate] = Field(..., min_length=1)
    
    @field_validator('definitions')
    @classmethod
    def validate_definitions(cls, v):
        if not v:
            raise ValueError('At least one definition is required')
        
        # Check for duplicate languages
        languages = [d.language for d in v]
        if len(languages) != len(set(languages)):
            raise ValueError('Duplicate language codes are not allowed')
        
        return v


class TermUpdate(BaseModel):
    """Schema for updating a term"""
    keyword: Optional[str] = Field(None, min_length=1, max_length=255)
    category_id: Optional[UUID] = None


class CreatorSchema(BaseModel):
    id: int
    full_name: Optional[str] = None
    email: str

    class Config:
        from_attributes = True


class TermResponse(TermBase):
    """Schema for term response"""
    id: UUID
    category_id: UUID
    category: CategoryResponse
    definitions: List[DefinitionResponse]
    creator: Optional[CreatorSchema] = None
    is_deleted: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class TermDetailResponse(TermResponse):
    """Extended term response with audit info"""
    creator_id: Optional[int] = None
    deleted_at: Optional[datetime] = None
    deleted_by: Optional[int] = None


# ============================================================================
# Bulk Operation Schemas
# ============================================================================

class BulkTermCreate(BaseModel):
    """Schema for bulk term creation"""
    terms: List[TermCreate] = Field(..., min_length=1, max_length=100)


class BulkTermDelete(BaseModel):
    """Schema for bulk term deletion"""
    term_ids: List[UUID] = Field(..., min_length=1, max_length=100)


class BulkOperationResult(BaseModel):
    """Result for a single bulk operation"""
    success: bool
    id: Optional[UUID] = None
    keyword: Optional[str] = None
    error: Optional[str] = None


class BulkOperationResponse(BaseModel):
    """Schema for bulk operation response"""
    total: int
    successful: int
    failed: int
    results: List[BulkOperationResult]


# ============================================================================
# Search Schemas
# ============================================================================

class SearchQuery(BaseModel):
    """Schema for search query"""
    q: str = Field(..., min_length=1, max_length=255)
    language: Optional[str] = Field(None, min_length=2, max_length=2, pattern=r'^[a-z]{2}$')
    category: Optional[str] = None  # Category slug
    offset: int = Field(default=0, ge=0)
    limit: int = Field(default=20, ge=1, le=100)


class SearchResponse(BaseModel):
    """Schema for search response"""
    total: int
    offset: int
    limit: int
    results: List[TermResponse]


# ============================================================================
# Audit Log Schemas
# ============================================================================

class AuditLogResponse(BaseModel):
    """Schema for audit log response"""
    id: UUID
    term_id: UUID
    user_id: Optional[int]
    action: str
    changes: Optional[str]
    timestamp: datetime
    
    class Config:
        from_attributes = True
