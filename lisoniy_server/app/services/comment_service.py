"""Comment service for CRUD operations and notifications"""
from typing import List, Optional, Dict
from fastapi import BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy import select, func

from app.models import Comment, Post, User
from app.schemas.content import CommentCreate
from app.services.email_service import EmailService


def mock_send_reply_notification(email_to: str, post_title: str, commenter_name: str):
    """
    Mock function to simulate sending an email notification for a comment reply.
    In a real application, this would use a proper background task runner like Celery.
    """
    print(f"--- MOCK EMAIL ---")
    print(f"To: {email_to}")
    print(f"Subject: You have a new reply on '{post_title}'")
    print(f"Body: {commenter_name} has replied to your comment.")
    print(f"------------------")


class CommentService:
    @staticmethod
    async def create_comment(
        db: AsyncSession,
        comment_data: CommentCreate,
        post_id: int,
        current_user: User,
        background_tasks: BackgroundTasks,
    ) -> Comment:
        """
        Create a new comment and trigger a notification if it's a reply.
        """
        post_result = await db.execute(select(Post).where(Post.id == post_id))
        post = post_result.scalar_one_or_none()
        if not post:
            raise ValueError("Post not found")

        parent_comment = None
        if comment_data.parent_id:
            parent_comment_result = await db.execute(
                select(Comment)
                .options(selectinload(Comment.owner))
                .where(Comment.id == comment_data.parent_id)
            )
            parent_comment = parent_comment_result.scalar_one_or_none()
            if not parent_comment or parent_comment.post_id != post_id:
                raise ValueError("Parent comment not found or does not belong to this post.")

        new_comment = Comment(
            body=comment_data.body,
            post_id=post_id,
            owner_id=current_user.id,
            parent_id=comment_data.parent_id,
        )
        print(f"DEBUG: create_comment - adding to DB", flush=True)
        db.add(new_comment)
        await db.commit()
        print(f"DEBUG: create_comment - committed", flush=True)
        await db.refresh(new_comment, ["owner"])
        print(f"DEBUG: create_comment - refreshed owner", flush=True)

        if parent_comment and parent_comment.owner:
            print(f"DEBUG: create_comment - handling parent owner notification", flush=True)
            parent_owner = parent_comment.owner
            
            if parent_owner.id != current_user.id:
                background_tasks.add_task(
                    mock_send_reply_notification,
                    parent_owner.email,
                    post.title,
                    current_user.full_name or current_user.email,
                )
                print(f"DEBUG: create_comment - notification task added", flush=True)

        print(f"DEBUG: create_comment - returning", flush=True)
        return new_comment

    @staticmethod
    async def get_comments_for_post(db: AsyncSession, post_id: int) -> List[Comment]:
        """
        Get all comments for a specific post.
        """
        result = await db.execute(
            select(Comment)
            .options(selectinload(Comment.owner))
            .where(Comment.post_id == post_id)
            .order_by(Comment.created_at.asc())
        )
        return list(result.scalars().all())

    @staticmethod
    def _comment_to_dict(comment: Comment) -> dict:
        """
        Safely convert a Comment model and its owner to a dictionary.
        """
        owner_data = None
        if comment.owner:
            owner_data = {
                "id": comment.owner.id,
                "email": comment.owner.email,
                "full_name": comment.owner.full_name,
                "phone": comment.owner.phone,
                "role": comment.owner.role,
                "is_active": comment.owner.is_active,
                "is_verified": comment.owner.is_verified,
                "last_login": comment.owner.last_login,
                "created_at": comment.owner.created_at,
                "updated_at": comment.owner.updated_at,
            }
        
        return {
            "id": comment.id,
            "body": comment.body,
            "owner_id": comment.owner_id,
            "post_id": comment.post_id,
            "parent_id": comment.parent_id,
            "created_at": comment.created_at,
            "updated_at": comment.updated_at,
            "owner": owner_data,
            "replies": []
        }

    @staticmethod
    def build_comment_tree(comments: List[Comment]) -> List[dict]:
        """
        Builds a nested tree structure from a flat list of comments efficiently.
        Returns a list of dictionaries.
        """
        # Convert all comments to dicts first
        comment_dicts = [CommentService._comment_to_dict(c) for c in comments]
        comment_map: Dict[int, dict] = {d["id"]: d for d in comment_dicts}
        tree: List[dict] = []
        
        for d in comment_dicts:
            if d["parent_id"]:
                parent = comment_map.get(d["parent_id"])
                if parent:
                    parent["replies"].append(d)
                else:
                    # If parent not found (shouldn't happen with correct data), 
                    # treat as top-level to avoid losing data
                    tree.append(d)
            else:
                tree.append(d)
        return tree

    @staticmethod
    async def get_comment_count(db: AsyncSession, post_id: int) -> int:
        """
        Get the total number of comments for a specific post.
        """
        result = await db.execute(
            select(func.count(Comment.id)).where(Comment.post_id == post_id)
        )
        return result.scalar() or 0
