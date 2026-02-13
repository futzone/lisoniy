from typing import Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, func
from sqlalchemy.orm import selectinload

from app.db.session import get_db
from app.models.user import User
from app.models.user_meta import UserMeta
from app.models.post import Post
from app.models.dataset import Dataset
from pydantic import BaseModel

router = APIRouter()

class LeaderboardUser(BaseModel):
    id: int
    full_name: str | None
    nickname: str | None
    avatar_image: str | None
    ball: int
    rank: str | None = None
    total_posts: int = 0
    total_datasets: int = 0

@router.get("/", response_model=List[LeaderboardUser])
async def get_leaderboard(
    limit: int = 50,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Get top contributors based on 'ball' (score).
    """
    # Join User and UserMeta, order by UserMeta.ball desc
    # Also load posts and datasets counts efficiently? 
    # Or just load relationship if list is small (limit 50 is fine).
    
    stmt = (
        select(User)
        .join(UserMeta)
        .options(
            selectinload(User.meta),
            selectinload(User.posts),
            selectinload(User.datasets)
        )
        .order_by(desc(UserMeta.ball))
        .limit(limit)
    )
    
    result = await db.execute(stmt)
    users = result.scalars().all()
    
    response = []
    for user in users:
        # Determine rank string
        score = user.meta.ball
        rank = "Beginner"
        if score > 1000: rank = "Legend"
        elif score > 500: rank = "Master"
        elif score > 100: rank = "Expert"
        elif score > 50: rank = "Advanced"
        
        # Count posts
        post_count = len(user.posts)
        
        # Count datasets
        dataset_count = len(user.datasets)
        
        response.append(LeaderboardUser(
            id=user.id,
            full_name=user.full_name,
            nickname=user.meta.nickname,
            avatar_image=user.meta.avatar_image,
            ball=score,
            rank=rank,
            total_posts=post_count,
            total_datasets=dataset_count
        ))
        
    return response
