"""Schemas for posts and comments"""
from datetime import datetime
from typing import List, Optional, Any
from pydantic import BaseModel, Field
from app.models.post import PostType
from app.schemas.user import UserResponse


class CommentBase(BaseModel):
    body: str


class CommentCreate(CommentBase):
    parent_id: Optional[int] = None


class CommentResponse(CommentBase):
    id: int
    owner_id: int
    post_id: int
    parent_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    owner: UserResponse

    class Config:
        from_attributes = True


class CommentWithRepliesResponse(CommentResponse):
    replies: List["CommentWithRepliesResponse"] = []


class PostBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=255)
    body: str = Field(..., min_length=10)
    type: PostType = PostType.DISCUSSION
    tags: Optional[List[str]] = Field(default=[], description="List of tags (e.g., ['python', 'fastapi'])")


class PostCreate(PostBase):
    pass


class PostUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=3, max_length=255)
    body: Optional[str] = Field(None, min_length=10)
    tags: Optional[List[str]] = None


class PostResponse(PostBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: datetime
    owner: UserResponse
    files: Optional[List[Any]] = []
    tags: Optional[List[str]] = []
    total_likes: int = 0
    total_views: int = 0
    total_comments: int = 0
    is_liked: bool = False

    class Config:
        from_attributes = True


class PostWithCommentsResponse(PostResponse):
    comments: List[CommentWithRepliesResponse] = []
