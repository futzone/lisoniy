"""API endpoints for comments"""
from fastapi import APIRouter, Depends, status, BackgroundTasks, HTTPException
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models import User
from app.schemas.content import CommentCreate, CommentResponse, CommentWithRepliesResponse
from app.services import CommentService
from app.core.dependencies import get_current_active_user

router = APIRouter()


@router.post("/{post_id}", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
async def create_comment(
    post_id: int,
    comment_data: CommentCreate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Create a new comment on a post. If `parent_id` is provided, it's a reply
    and will trigger a notification to the parent comment's author.
    """
    try:
        comment = await CommentService.create_comment(
            db, comment_data, post_id, current_user, background_tasks
        )
        
        # Manually map to CommentResponse to avoid serialization issues
        return CommentResponse(
            id=comment.id,
            body=comment.body,
            owner_id=comment.owner_id,
            post_id=comment.post_id,
            parent_id=comment.parent_id,
            created_at=comment.created_at,
            updated_at=comment.updated_at,
            owner={
                "id": current_user.id,
                "email": current_user.email,
                "full_name": current_user.full_name,
                "phone": current_user.phone,
                "role": current_user.role,
                "is_active": current_user.is_active,
                "is_verified": current_user.is_verified,
                "last_login": current_user.last_login,
                "created_at": current_user.created_at,
                "updated_at": current_user.updated_at,
            }
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/{post_id}", response_model=List[CommentWithRepliesResponse])
async def get_comments(
    post_id: int,
    db: AsyncSession = Depends(get_db),
):
    """
    Get all comments for a post as a nested tree.
    """
    try:
        comments = await CommentService.get_comments_for_post(db, post_id)
        tree = CommentService.build_comment_tree(comments)
        return tree
    except Exception as e:
        raise
