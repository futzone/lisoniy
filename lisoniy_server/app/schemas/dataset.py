"""Pydantic schemas for dataset management"""

from datetime import datetime
from typing import Optional, Any
from uuid import UUID

from pydantic import BaseModel, Field, field_validator
from app.schemas.dataset_meta import DatasetMetaResponse


# ==================== Dataset Schemas ====================

class DatasetCreate(BaseModel):
    """Schema for creating a new dataset"""
    name: str = Field(..., min_length=1, max_length=255, description="Dataset name")
    type: str = Field(..., min_length=1, max_length=50, description="Dataset type (instruction, parallel, ner, legal_qa)")
    description: Optional[str] = Field(None, description="Optional dataset description")
    is_public: bool = Field(False, description="Whether the dataset is publicly visible")


class DatasetUpdate(BaseModel):
    """Schema for updating a dataset"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    is_public: Optional[bool] = None


class DatasetResponse(BaseModel):
    """Schema for dataset response"""
    id: UUID
    name: str
    type: str
    description: Optional[str]
    is_public: bool
    creator_id: int
    created_at: datetime
    updated_at: datetime
    entry_count: int = Field(0, description="Number of entries in this dataset")
    meta: Optional[DatasetMetaResponse] = Field(None, description="Dataset metadata (optional)")
    
    model_config = {"from_attributes": True}


# ==================== DataEntry Schemas ====================

class DataEntryCreate(BaseModel):
    """Schema for creating a single data entry"""
    dataset_id: UUID = Field(..., description="ID of the dataset this entry belongs to")
    content: dict[str, Any] = Field(..., description="Entry content (polymorphic structure)")
    metadata: Optional[dict[str, Any]] = Field(None, description="Optional metadata (tags, source, etc.)")
    
    @field_validator('content')
    @classmethod
    def validate_content_not_empty(cls, v: dict) -> dict:
        """Ensure content is not empty"""
        if not v:
            raise ValueError("Content cannot be empty")
        return v


class DataEntryUpdate(BaseModel):
    """Schema for updating a data entry"""
    content: Optional[dict[str, Any]] = None
    metadata: Optional[dict[str, Any]] = None
    
    @field_validator('content')
    @classmethod
    def validate_content_not_empty(cls, v: Optional[dict]) -> Optional[dict]:
        """Ensure content is not empty if provided"""
        if v is not None and not v:
            raise ValueError("Content cannot be empty")
        return v


class DataEntryResponse(BaseModel):
    """Schema for data entry response"""
    id: UUID
    dataset_id: UUID
    content: dict[str, Any]
    entry_metadata: Optional[dict[str, Any]] = Field(None, serialization_alias="metadata")
    hash_key: str
    creator_id: int
    created_at: datetime
    updated_at: datetime
    
    model_config = {
        "from_attributes": True,
        "populate_by_name": True
    }


# ==================== Bulk Operation Schemas ====================

class BulkDataEntryCreate(BaseModel):
    """Schema for bulk creating data entries"""
    dataset_id: UUID = Field(..., description="ID of the dataset")
    entries: list[dict[str, Any]] = Field(..., description="List of entry content objects")
    
    @field_validator('entries')
    @classmethod
    def validate_entries_limit(cls, v: list) -> list:
        """Validate entries list"""
        if not v:
            raise ValueError("Entries list cannot be empty")
        if len(v) > 1000:
            raise ValueError("Maximum 1000 entries per bulk request")
        # Check each entry is not empty
        for idx, entry in enumerate(v):
            if not entry:
                raise ValueError(f"Entry at index {idx} is empty")
        return v


class BulkDeleteRequest(BaseModel):
    """Schema for bulk deleting data entries"""
    entry_ids: list[UUID] = Field(..., description="List of entry IDs to delete")
    
    @field_validator('entry_ids')
    @classmethod
    def validate_ids_limit(cls, v: list) -> list:
        """Validate IDs list"""
        if not v:
            raise ValueError("Entry IDs list cannot be empty")
        if len(v) > 1000:
            raise ValueError("Maximum 1000 entries per bulk delete")
        # Remove duplicates
        unique_ids = list(set(v))
        if len(unique_ids) != len(v):
            return unique_ids
        return v


class BulkOperationResult(BaseModel):
    """Schema for bulk operation result"""
    total: int = Field(..., description="Total number of entries processed")
    created: int = Field(0, description="Number of entries successfully created")
    skipped: int = Field(0, description="Number of entries skipped (duplicates)")
    deleted: int = Field(0, description="Number of entries successfully deleted")
    failed: int = Field(0, description="Number of entries that failed")
    errors: list[str] = Field(default_factory=list, description="List of error messages")


# ==================== Search/Filter Schemas ====================

class DataEntryFilter(BaseModel):
    """Schema for filtering data entries"""
    dataset_id: Optional[UUID] = Field(None, description="Filter by dataset ID")
    dataset_type: Optional[str] = Field(None, description="Filter by dataset type")
    offset: int = Field(0, ge=0, description="Pagination offset")
    limit: int = Field(20, ge=1, le=100, description="Pagination limit")


class DataEntrySearchResponse(BaseModel):
    """Schema for paginated data entry search response"""
    total: int = Field(..., description="Total number of matching entries")
    offset: int = Field(..., description="Current offset")
    limit: int = Field(..., description="Current limit")
    entries: list[DataEntryResponse] = Field(..., description="List of data entries")


class DatasetListResponse(BaseModel):
    """Schema for paginated dataset list response"""
    total: int = Field(..., description="Total number of datasets")
    offset: int = Field(..., description="Current offset")
    limit: int = Field(..., description="Current limit")
    datasets: list[DatasetResponse] = Field(..., description="List of datasets")
