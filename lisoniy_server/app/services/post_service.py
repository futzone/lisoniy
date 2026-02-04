"""Post service for CRUD operations and business logic"""
import os
import uuid
import json
from typing import List, Optional, Tuple
from fastapi import UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy import select, func

from app.models import Post, User, PostType
from app.schemas.content import PostCreate, PostUpdate
from app.services.redis_manager import redis_manager
from app.core.config import settings


class PostService:
    @staticmethod
    async def _invalidate_post_cache(post_id: int):
        """Invalidate the cache for a single post."""
        cache_key = f"post:{post_id}"
        await redis_manager.delete_key(cache_key)

    @staticmethod
    async def create_post(
        db: AsyncSession,
        post_data: PostCreate,
        current_user: User,
        files: List[UploadFile],
    ) -> Post:
        """
        Create a new post with optional file uploads.
        """
        # Filter out empty files (files with no filename or empty filename)
        valid_files = [f for f in (files or []) if f and f.filename and f.filename.strip()]
        
        file_urls = []
        if valid_files:
            # Only check for UPLOADS_DIR if we have files to upload
            if not settings.UPLOADS_DIR:
                raise ValueError("UPLOADS_DIR is not configured in settings.")
            for file in valid_files:
                _, extension = os.path.splitext(file.filename)
                file_name = f"{uuid.uuid4()}{extension}"
                file_path = os.path.join(settings.UPLOADS_DIR, file_name)

                os.makedirs(settings.UPLOADS_DIR, exist_ok=True)

                with open(file_path, "wb") as buffer:
                    buffer.write(await file.read())
                
                file_urls.append(f"/static/{file_name}")

        # Normalize tags (remove # and convert to lowercase)
        tags = post_data.tags or []
        normalized_tags = [tag.lstrip('#').lower() for tag in tags if tag.strip()]

        new_post = Post(
            **post_data.model_dump(exclude={'tags'}),
            owner_id=current_user.id,
            files=file_urls,
            tags=normalized_tags,
        )
        db.add(new_post)
        await db.commit()
        await db.refresh(new_post)
        
        # Explicitly load the owner relationship
        result = await db.execute(
            select(Post).options(selectinload(Post.owner)).where(Post.id == new_post.id)
        )
        new_post = result.scalar_one()
        
        return new_post

    @staticmethod
    async def get_post(db: AsyncSession, post_id: int) -> Optional[Post]:
        """
        Get a single post by ID, with caching.
        """
        cache_key = f"post:{post_id}"
        try:
            cached_post = await redis_manager.get_value(cache_key)
            if cached_post:
                post_dict = json.loads(cached_post)
                owner_data = post_dict.pop('owner', None)
                
                # Only use cache if it has owner data (consistent with schema requirements)
                if owner_data:
                    post = Post(**post_dict)
                    post.owner = User(**owner_data)
                    return post
        except Exception as e:
            print(f"DEBUG: Cache retrieval failed for post:{post_id}: {e}")

        result = await db.execute(
            select(Post).options(selectinload(Post.owner)).where(Post.id == post_id)
        )
        post = result.scalar_one_or_none()

        if post:
            try:
                await redis_manager.redis.incr(f"post:views:{post_id}")
                # Cache the dict representation
                await redis_manager.set_value(cache_key, post.to_dict(), expire=3600)
            except Exception as e:
                print(f"DEBUG: Cache storage failed for post:{post_id}: {e}")
        
        return post

    @staticmethod
    async def get_all_posts(
        db: AsyncSession, skip: int, limit: int, post_type: Optional[PostType], tag: Optional[str] = None
    ) -> Tuple[List[Post], int]:
        """
        Get all posts with pagination and optional filtering by type and tags.
        """
        query = select(Post).options(selectinload(Post.owner))
        count_query = select(func.count()).select_from(Post)

        if post_type:
            query = query.where(Post.type == post_type)
            count_query = count_query.where(Post.type == post_type)
        
        if tag:
            # Normalize tag (remove # if present, convert to lowercase)
            tag_normalized = tag.lstrip('#').lower()
            # PostgreSQL JSONB contains check: tags @> '["tagname"]'
            query = query.where(Post.tags.contains([tag_normalized]))
            count_query = count_query.where(Post.tags.contains([tag_normalized]))

        total_posts_result = await db.execute(count_query)
        total_posts = total_posts_result.scalar_one_or_none() or 0

        result = await db.execute(
            query.order_by(Post.created_at.desc()).offset(skip).limit(limit)
        )
        posts = list(result.scalars().all())
        
        return posts, total_posts

    @staticmethod
    async def update_post(
        db: AsyncSession, post_id: int, post_data: PostUpdate, current_user: User
    ) -> Optional[Post]:
        """
        Update a post.
        """
        result = await db.execute(select(Post).where(Post.id == post_id))
        post = result.scalar_one_or_none()
        
        if not post or post.owner_id != current_user.id:
            return None

        update_data = post_data.model_dump(exclude_unset=True)
        
        # Normalize tags if provided
        if 'tags' in update_data and update_data['tags'] is not None:
            update_data['tags'] = [tag.lstrip('#').lower() for tag in update_data['tags'] if tag.strip()]
        
        for field, value in update_data.items():
            setattr(post, field, value)
        
        await db.commit()
        await db.refresh(post)
        await PostService._invalidate_post_cache(post_id)
        return post

    @staticmethod
    async def delete_post(db: AsyncSession, post_id: int, current_user: User) -> bool:
        """
        Delete a post.
        """
        result = await db.execute(select(Post).where(Post.id == post_id))
        post = result.scalar_one_or_none()

        if not post or post.owner_id != current_user.id:
            return False

        await db.delete(post)
        await db.commit()
        await PostService._invalidate_post_cache(post_id)
        return True

    @staticmethod
    async def like_post(post_id: int, user_id: int):
        """
        Toggle a user's like to a post in Redis.
        """
        key = f"post:likes:{post_id}"
        is_member = await redis_manager.redis.sismember(key, user_id)
        if is_member:
            await redis_manager.redis.srem(key, user_id)
        else:
            await redis_manager.redis.sadd(key, user_id)
        await PostService._invalidate_post_cache(post_id)

    @staticmethod
    async def unlike_post(post_id: int, user_id: int):
        """
        Explicitly remove a user's like from a post in Redis.
        """
        key = f"post:likes:{post_id}"
        await redis_manager.redis.srem(key, user_id)
        await PostService._invalidate_post_cache(post_id)

    @staticmethod
    async def is_post_liked(post_id: int, user_id: int) -> bool:
        """
        Check if a post is liked by a specific user.
        """
        key = f"post:likes:{post_id}"
        return await redis_manager.redis.sismember(key, user_id)
        
    @staticmethod
    async def get_post_metrics(post_id: int) -> dict:
        """
        Get total likes and views for a post from Redis.
        """
        views_key = f"post:views:{post_id}"
        likes_key = f"post:likes:{post_id}"

        total_views = await redis_manager.get_value(views_key)
        total_likes = await redis_manager.redis.scard(likes_key)

        return {
            "total_views": int(total_views) if total_views else 0,
            "total_likes": total_likes,
        }
    
    @staticmethod
    async def get_popular_tags(db: AsyncSession, limit: int = 10) -> list[dict]:
        """
        Get the most used tags with their post counts.
        
        Uses PostgreSQL JSONB unnesting to aggregate tag usage.
        
        Args:
            db: Database session
            limit: Number of top tags to return (default 10)
            
        Returns:
            List of dicts with 'tag' and 'contents' keys
        """
        from sqlalchemy import text
        
        # PostgreSQL query to unnest JSONB array and count occurrences
        query = text("""
            SELECT 
                tag::text as tag,
                COUNT(*) as contents
            FROM posts,
                 jsonb_array_elements_text(tags) AS tag
            WHERE tags IS NOT NULL
            GROUP BY tag
            ORDER BY contents DESC
            LIMIT :limit
        """)
        
        result = await db.execute(query, {"limit": limit})
        rows = result.fetchall()
        
        return [{"tag": row.tag, "contents": row.contents} for row in rows]

