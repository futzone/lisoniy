"""User service for CRUD operations"""

from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException, status

from app.models.user import User, UserRole
from app.schemas.user import UserCreate, UserUpdate, AdminUserUpdate
from app.core.security import get_password_hash


class UserService:
    """Service for user management operations"""
    
    @staticmethod
    async def get_user_by_id(db: AsyncSession, user_id: int) -> Optional[User]:
        """
        Get user by ID
        
        Args:
            db: Database session
            user_id: User ID
            
        Returns:
            User or None
        """
        result = await db.execute(select(User).where(User.id == user_id))
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_user_by_email(db: AsyncSession, email: str) -> Optional[User]:
        """
        Get user by email
        
        Args:
            db: Database session
            email: User email
            
        Returns:
            User or None
        """
        result = await db.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()
    
    @staticmethod
    async def create_user(db: AsyncSession, user_data: UserCreate) -> User:
        """
        Create a new user
        
        Args:
            db: Database session
            user_data: User creation data
            
        Returns:
            Created user
            
        Raises:
            HTTPException: If email already exists
        """
        # Check if email already exists
        existing_user = await UserService.get_user_by_email(db, user_data.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create new user
        hashed_password = get_password_hash(user_data.password)
        new_user = User(
            email=user_data.email,
            hashed_password=hashed_password,
            full_name=user_data.full_name,
            phone=user_data.phone,
            is_active=True,
            is_verified=False,
            role=UserRole.USER,
        )
        
        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)
        
        # Create user meta
        from app.models.user_meta import UserMeta
        user_meta = UserMeta(user_id=new_user.id)
        db.add(user_meta)
        await db.commit()
        
        return new_user
    
    @staticmethod
    async def update_user(
        db: AsyncSession,
        user_id: int,
        user_data: UserUpdate
    ) -> Optional[User]:
        """
        Update user profile
        
        Args:
            db: Database session
            user_id: User ID
            user_data: Update data
            
        Returns:
            Updated user or None
        """
        user = await UserService.get_user_by_id(db, user_id)
        if not user:
            return None
        
        # Update fields
        update_data = user_data.model_dump(exclude_unset=True)
        
        for field, value in update_data.items():
            setattr(user, field, value)
        
        await db.commit()
        await db.refresh(user)
        
        return user
    
    @staticmethod
    async def admin_update_user(
        db: AsyncSession,
        user_id: int,
        user_data: AdminUserUpdate
    ) -> Optional[User]:
        """
        Admin update user (can modify role, status, etc.)
        
        Args:
            db: Database session
            user_id: User ID
            user_data: Update data
            
        Returns:
            Updated user or None
        """
        user = await UserService.get_user_by_id(db, user_id)
        if not user:
            return None
        
        # Update fields
        update_data = user_data.model_dump(exclude_unset=True)
        
        for field, value in update_data.items():
            setattr(user, field, value)
        
        await db.commit()
        await db.refresh(user)
        
        return user
    
    @staticmethod
    async def delete_user(db: AsyncSession, user_id: int) -> bool:
        """
        Delete a user
        
        Args:
            db: Database session
            user_id: User ID
            
        Returns:
            True if deleted, False if not found
        """
        result = await db.execute(delete(User).where(User.id == user_id))
        await db.commit()
        
        return result.rowcount > 0
    
    @staticmethod
    async def get_all_users(
        db: AsyncSession,
        skip: int = 0,
        limit: int = 100
    ) -> List[User]:
        """
        Get all users (admin only)
        
        Args:
            db: Database session
            skip: Number of records to skip
            limit: Maximum number of records to return
            
        Returns:
            List of users
        """
        result = await db.execute(select(User).offset(skip).limit(limit))
        return list(result.scalars().all())
    
    @staticmethod
    async def verify_user_email(db: AsyncSession, user_id: int) -> Optional[User]:
        """
        Mark user email as verified
        
        Args:
            db: Database session
            user_id: User ID
            
        Returns:
            Updated user or None
        """
        user = await UserService.get_user_by_id(db, user_id)
        if not user:
            return None
        
        user.is_verified = True
        await db.commit()
        await db.refresh(user)
        
        return user
    
    @staticmethod
    async def update_last_login(db: AsyncSession, user_id: int) -> None:
        """
        Update user's last login timestamp
        
        Args:
            db: Database session
            user_id: User ID
        """
        from datetime import datetime
        
        await db.execute(
            update(User).where(User.id == user_id).values(last_login=datetime.utcnow())
        )
        await db.commit()
    
    @staticmethod
    async def get_user_activity(db: AsyncSession, user_id: int) -> dict:
        """
        Get aggregated user activity
        
        Args:
            db: Database session
            user_id: User ID
            
        Returns:
            Dictionary with activity_logs, datasets, discussions, articles
        """
        from app.models.terminology import TermAuditLog
        from app.models.dataset import Dataset, DataEntry
        from app.models.post import Post
        from sqlalchemy.orm import selectinload
        from sqlalchemy import func as sql_func
        
        # Get last 10 term audit logs
        activity_logs_result = await db.execute(
            select(TermAuditLog)
            .options(selectinload(TermAuditLog.term))
            .where(TermAuditLog.user_id == user_id)
            .order_by(TermAuditLog.timestamp.desc())
            .limit(10)
        )
        activity_logs = list(activity_logs_result.scalars().all())
        
        # Get last 10 datasets with entry counts
        datasets_result = await db.execute(
            select(Dataset)
            .where(Dataset.creator_id == user_id)
            .order_by(Dataset.created_at.desc())
            .limit(10)
        )
        datasets = list(datasets_result.scalars().all())
        
        # Add entry count for each dataset
        for dataset in datasets:
            count_query = select(sql_func.count()).where(DataEntry.dataset_id == dataset.id)
            count = await db.scalar(count_query)
            dataset.entry_count = count or 0
        
        # Get last 10 discussions
        discussions_result = await db.execute(
            select(Post)
            .options(selectinload(Post.owner))
            .where(Post.owner_id == user_id, Post.type == "discussion")
            .order_by(Post.created_at.desc())
            .limit(10)
        )
        discussions = list(discussions_result.scalars().all())
        
        # Get last 10 articles
        articles_result = await db.execute(
            select(Post)
            .options(selectinload(Post.owner))
            .where(Post.owner_id == user_id, Post.type == "article")
            .order_by(Post.created_at.desc())
            .limit(10)
        )
        articles = list(articles_result.scalars().all())
        
        return {
            "activity_logs": activity_logs,
            "datasets": datasets,
            "discussions": discussions,
            "articles": articles
        }
    
    @staticmethod
    async def get_top_authors(db: AsyncSession, limit: int = 5) -> List[dict]:
        """
        Get top authors by post contribution
        Args:
            db: Database session
            limit: Limit number of authors
        Returns:
            List of dict with user info and contribution count
        """
        from app.models.post import Post
        from app.models.user import User
        from sqlalchemy import func as sql_func, desc

        try:
            # Aggregate posts by owner - explicitly group by all selected columns for safety
            stmt = (
                select(
                    User.id, 
                    User.full_name, 
                    User.email, 
                    User.is_verified, 
                    User.avatar_url if hasattr(User, 'avatar_url') else sql_func.literal("").label("avatar_url"), # Handle potential missing column gracefully
                    sql_func.count(Post.id).label("contributions")
                )
                .join(Post, User.id == Post.owner_id)
                .group_by(User.id, User.full_name, User.email, User.is_verified)
                .order_by(desc("contributions"))
                .limit(limit)
            )
            
            result = await db.execute(stmt)
            rows = result.all()
            
            authors = []
            for row in rows:
                contribution_count = row.contributions
                
                # Determine rank based on contributions
                if contribution_count >= 50:
                    rank = "Expert"
                elif contribution_count >= 20:
                    rank = "Advanced"
                elif contribution_count >= 5:
                    rank = "Intermediate"
                else:
                    rank = "Beginner"

                # Determine specialization (Mock logic for now)
                specialization = "Hamjamiyat a'zosi"
                
                # Safe name extraction
                display_name = row.full_name or (row.email.split('@')[0] if row.email else "User")
                
                authors.append({
                    "id": row.id,
                    "name": display_name, 
                    "email": row.email,
                    "avatar": (display_name)[0:2].upper(),
                    "contributions": contribution_count,
                    "rank": rank,
                    "specialization": specialization
                })
                
            return authors
        except Exception as e:
            print(f"CRITICAL ERROR in get_top_authors REAL QUERY: {e}", flush=True)
            import traceback
            traceback.print_exc()
            return []
    @staticmethod
    async def get_user_meta(db: AsyncSession, user_id: int) -> dict:
        """
        Get user meta with calculated stats and ball
        """
        from app.models.user_meta import UserMeta
        from app.models.post import Post
        from app.models.dataset import Dataset, DataEntry
        from app.models.dataset_meta import DatasetStar
        from app.models.terminology import Term
        from app.services.redis_manager import redis_manager
        from sqlalchemy import func as sql_func, desc
        from sqlalchemy.orm import selectinload

        # 1. Get or Create UserMeta
        result = await db.execute(select(UserMeta).options(selectinload(UserMeta.user)).where(UserMeta.user_id == user_id))
        meta = result.scalar_one_or_none()
        
        if not meta:
            # Create default meta
            meta = UserMeta(user_id=user_id)
            db.add(meta)
            await db.commit()
            await db.refresh(meta)
            # Need to reload user relationship
            result = await db.execute(select(UserMeta).options(selectinload(UserMeta.user)).where(UserMeta.id == meta.id))
            meta = result.scalar_one()

        # 2. Calculate Stats
        
        # Counts
        articles_count = await db.scalar(
            select(sql_func.count(Post.id)).where(Post.owner_id == user_id, Post.type == "article")
        ) or 0
        
        discussions_count = await db.scalar(
            select(sql_func.count(Post.id)).where(Post.owner_id == user_id, Post.type == "discussion")
        ) or 0
        
        datasets_count = await db.scalar(
            select(sql_func.count(Dataset.id)).where(Dataset.creator_id == user_id)
        ) or 0
        
        terms_count = await db.scalar(
            select(sql_func.count(Term.id)).where(Term.creator_id == user_id)
        ) or 0
        
        entries_count = await db.scalar(
            select(sql_func.count(DataEntry.id)).where(DataEntry.creator_id == user_id)
        ) or 0
        
        # Stars (on user's datasets)
        # Join DatasetStar -> Dataset -> where Dataset.creator_id == user_id
        stars_count = await db.scalar(
            select(sql_func.count(DatasetStar.id))
            .join(Dataset, DatasetStar.dataset_id == Dataset.id)
            .where(Dataset.creator_id == user_id)
        ) or 0

        # Likes (from Redis)
        # Fetch all user post IDs
        user_posts_result = await db.execute(select(Post.id).where(Post.owner_id == user_id))
        user_post_ids = user_posts_result.scalars().all()
        
        likes_count = 0
        if user_post_ids:
            try:
                pipeline = redis_manager.redis.pipeline()
                for pid in user_post_ids:
                    pipeline.scard(f"post:likes:{pid}")
                
                results = await pipeline.execute()
                likes_count = sum(results)
            except Exception as e:
                print(f"Error fetching likes for user {user_id}: {e}")
        
        # Dataset Size Bonuses
        # Get all datasets of user and their entry counts
        # Optimised query: select dataset_id, count(entries) from data_entries join dataset ... group by dataset_id
        # Actually easier: select count(id) from data_entries where creator_id=user group by dataset_id
        # Wait, DataEntry.creator_id might differ from Dataset.creator_id (collaboration).
        # We want size of DATASETS created by User.
        # So: select Dataset.id, count(DataEntry.id) from Dataset left join DataEntry on ... where Dataset.creator_id == user ...
        
        ds_sizes_result = await db.execute(
            select(Dataset.id, sql_func.count(DataEntry.id))
            .outerjoin(DataEntry, Dataset.id == DataEntry.dataset_id)
            .where(Dataset.creator_id == user_id)
            .group_by(Dataset.id)
        )
        ds_sizes = ds_sizes_result.all() # list of (id, count)
        
        bonus_points = 0
        for _, count in ds_sizes:
            if count >= 200:
                bonus_points += 200 # +200 for 200+ items (as per request "200 for ... 200")
                # Request says: "+ 100 for ... 100+ item", "+ 200 for ... 200". 
                # Assuming cumulative if it hits 200? Or just 200?
                # "if in user dataset have a 1 star... +100 for ... 100+, +200 for ... 200"
                # Interpreting as: 
                # If size >= 100: +100
                # If size >= 200: +200 (Total +300? or just replacement +200?)
                # "200 ... 200" implies specific tier.
                # Let's do:
                # If size >= 200: +200
                # Elif size >= 100: +100
                # This seems safer to avoid double counting unless explicitly said "cumulative".
            elif count >= 100:
                bonus_points += 100

        # Calculate Ball
        # +10 per star
        # +3 per like
        # +5 per term
        # +5 per entry
        # +5 per added term (Term creation)
        # "if user created dataset and added... +5 for user every added termins" -> +5 per DataEntry (already counted in entries_count)
        
        ball = (
            (stars_count * 10) +
            (likes_count * 3) +
            (terms_count * 5) + 
            (entries_count * 5) + 
            bonus_points
        )
        
        # Update Meta if changed
        if meta.ball != ball:
            meta.ball = ball
            db.add(meta)
            await db.commit()
            await db.refresh(meta)
            
        # 3. Calculate Rank
        # Users rank higher if they have more ball, or same ball but earlier registration
        # Count users who rank above this user:
        #   - Users with higher ball
        #   - Users with same ball but registered earlier
        from sqlalchemy import or_, and_
        
        higher_rank_count = await db.scalar(
            select(sql_func.count(UserMeta.id))
            .join(User)
            .where(
                or_(
                    UserMeta.ball > ball,  # Higher score ranks higher
                    and_(
                        UserMeta.ball == ball,  # Same score...
                        User.created_at < meta.user.created_at  # ...but registered earlier
                    )
                )
            )
        ) or 0
        rank = higher_rank_count + 1
        
        return {
            "bio": meta.bio,
            "telegram": meta.telegram_url,
            "github": meta.github_url,
            "website": meta.website_url,
            "education": meta.education,
            "address": meta.address,
            "username": meta.nickname or (meta.user.email.split('@')[0] if meta.user.email else "user"),
            "articles": articles_count,
            "discussions": discussions_count,
            "datasets": datasets_count,
            "terms": terms_count,
            "entries": entries_count,
            "rank": rank,
            "ball": ball,
            "joined": meta.user.created_at,
            "user": meta.user, # Pydantic will handle this
            "last_activity": meta.updated_at, # Approximate
            "avatar_image": meta.avatar_image,
            "stars": stars_count,
            "likes": likes_count,
            "bonus": bonus_points
        }
        
    @staticmethod
    async def update_user_meta(db: AsyncSession, user_id: int, data: dict) -> dict:
        """Update user meta fields"""
        from app.models.user_meta import UserMeta
        
        # Get meta
        result = await db.execute(select(UserMeta).where(UserMeta.user_id == user_id))
        meta = result.scalar_one_or_none()
        
        if not meta:
            meta = UserMeta(user_id=user_id)
            db.add(meta)
        
        # Update fields
        for key, value in data.items():
            if hasattr(meta, key) and value is not None:
                setattr(meta, key, value)
        
        await db.commit()
        
        # Return full meta (re-using get_user_meta for consistency)
        return await UserService.get_user_meta(db, user_id)

    @staticmethod
    async def get_user_ranking(db: AsyncSession, limit: int = 50) -> List[dict]:
        """Get global user ranking"""
        from app.models.user_meta import UserMeta
        from app.models.user import User
        from sqlalchemy.orm import selectinload
        
        result = await db.execute(
            select(UserMeta)
            .options(selectinload(UserMeta.user))
            .order_by(UserMeta.ball.desc())
            .limit(limit)
        )
        metas = result.scalars().all()
        
        rankings = []
        for i, meta in enumerate(metas):
            rankings.append({
                "id": meta.user_id,
                "full_name": meta.user.full_name or "Unknown",
                "username": meta.nickname,
                "avatar_image": meta.avatar_image,
                "ball": meta.ball,
                "rank": i + 1,
                "joined": meta.user.created_at
            })
        return rankings
    
    @staticmethod
    async def get_user_meta_by_username(db: AsyncSession, username: str) -> Optional[dict]:
        """Get user meta by nickname/username"""
        from app.models.user_meta import UserMeta
        from app.models.user import User
        
        # Try finding by nickname
        result = await db.execute(select(UserMeta).where(UserMeta.nickname == username))
        meta = result.scalar_one_or_none()
        
        if meta:
            return await UserService.get_user_meta(db, meta.user_id)
            
        # If not found by nickname, try finding by email prefix (as fallback username)
        if not meta:
            # Check users with this email prefix
            # Note: This checks if email starts with "username@"
            # We need to join with User table
            stmt = select(UserMeta).join(User).where(User.email.like(f"{username}@%"))
            result = await db.execute(stmt)
            meta = result.scalar_one_or_none()
            
        if meta:
            return await UserService.get_user_meta(db, meta.user_id)
            
        return None
