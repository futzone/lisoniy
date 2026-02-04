"""User activity schemas for aggregated user data"""

from datetime import datetime
from typing import List
from uuid import UUID

from pydantic import BaseModel

from app.schemas.dataset import DatasetResponse
from app.schemas.content import PostResponse


class ActivityLogResponse(BaseModel):
    """Schema for activity log entry"""
    id: UUID
    action: str  # "create", "update", "delete"
    term_keyword: str
    timestamp: datetime
    
    model_config = {"from_attributes": True}


class UserActivityResponse(BaseModel):
    """Schema for aggregated user activity"""
    activity_logs: List[ActivityLogResponse]
    datasets: List[DatasetResponse]
    discussions: List[PostResponse]
    articles: List[PostResponse]
