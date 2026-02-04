"""User management API endpoints"""

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
import os
import time
import aiofiles
from app.core.config import settings

from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate
from app.services.user_service import UserService
from app.schemas.user_meta import UserMetaResponse, UserMetaUpdate, UserRankingResponse
from app.core.dependencies import get_current_user, get_current_active_user

router = APIRouter()


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
) -> UserResponse:
    """
    Get current authenticated user information
    
    Requires valid access token
    """
    return UserResponse.model_validate(current_user)


@router.put("/me", response_model=UserResponse)
async def update_current_user(
    user_data: UserUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
) -> UserResponse:
    """
    Update current user profile
    
    - **full_name**: Update full name
    - **phone**: Update phone number
    - **email**: Update email (requires re-verification)
    
    Requires verified account
    """
    updated_user = await UserService.update_user(db, current_user.id, user_data)
    
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserResponse.model_validate(updated_user)


@router.get("/me/activity")
async def get_my_activity(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get current user's recent activity (requires authentication)
    
    Returns aggregated activity including:
    - Last 10 term audit logs
    - Last 10 datasets created
    - Last 10 discussions
    - Last 10 articles
    """
    from app.schemas.user_activity import UserActivityResponse, ActivityLogResponse
    from app.schemas.dataset import DatasetResponse
    from app.schemas.content import PostResponse
    from app.services.post_service import PostService
    
    # Get aggregated activity
    activity_data = await UserService.get_user_activity(db, current_user.id)
    
    # Build activity log responses
    activity_logs = [
        ActivityLogResponse(
            id=log.id,
            action=log.action.value,
            term_keyword=log.term.keyword if log.term else "Unknown",
            timestamp=log.timestamp
        ) for log in activity_data["activity_logs"]
    ]
    
    # Build dataset responses
    datasets = [
        DatasetResponse.model_validate(ds) for ds in activity_data["datasets"]
    ]
    
    # Build discussion responses (with metrics)
    discussions = []
    for post in activity_data["discussions"]:
        metrics = await PostService.get_post_metrics(post.id)
        post_response = PostResponse.model_validate(post)
        post_response.total_likes = metrics["total_likes"]
        post_response.total_views = metrics["total_views"]
        discussions.append(post_response)
    
    # Build article responses (with metrics)
    articles = []
    for post in activity_data["articles"]:
        metrics = await PostService.get_post_metrics(post.id)
        post_response = PostResponse.model_validate(post)
        post_response.total_likes = metrics["total_likes"]
        post_response.total_views = metrics["total_views"]
        articles.append(post_response)
    
    return UserActivityResponse(
        activity_logs=activity_logs,
        datasets=datasets,
        discussions=discussions,
        articles=articles
    )


@router.get("/{user_id}/activity")
async def get_user_activity(
    user_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    Get user's recent activity (public, no auth required)
    
    Returns aggregated activity including:
    - Last 10 term audit logs
    - Last 10 datasets created
    - Last 10 discussions
    - Last 10 articles
    """
    from app.services.user_service import UserService
    from app.schemas.user_activity import UserActivityResponse, ActivityLogResponse
    from app.schemas.dataset import DatasetResponse
    from app.schemas.content import PostResponse
    from app.services.post_service import PostService
    
    # Check if user exists
    user = await UserService.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Get aggregated activity
    activity_data = await UserService.get_user_activity(db, user_id)
    
    # Build activity log responses
    activity_logs = [
        ActivityLogResponse(
            id=log.id,
            action=log.action.value,
            term_keyword=log.term.keyword if log.term else "Unknown",
            timestamp=log.timestamp
        ) for log in activity_data["activity_logs"]
    ]
    
    # Build dataset responses
    datasets = [
        DatasetResponse.model_validate(ds) for ds in activity_data["datasets"]
    ]
    
    # Build discussion responses (with metrics)
    discussions = []
    for post in activity_data["discussions"]:
        metrics = await PostService.get_post_metrics(post.id)
        post_response = PostResponse.model_validate(post)
        post_response.total_likes = metrics["total_likes"]
        post_response.total_views = metrics["total_views"]
        discussions.append(post_response)
    
    # Build article responses (with metrics)
    articles = []
    for post in activity_data["articles"]:
        metrics = await PostService.get_post_metrics(post.id)
        post_response = PostResponse.model_validate(post)
        post_response.total_likes = metrics["total_likes"]
        post_response.total_views = metrics["total_views"]
        articles.append(post_response)
    
    return UserActivityResponse(
        activity_logs=activity_logs,
        datasets=datasets,
        discussions=discussions,
        articles=articles
    )


@router.get("/me/meta", response_model=UserMetaResponse)
async def get_my_meta(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Get current user's detailed profile and calculated stats.
    """
    return await UserService.get_user_meta(db, current_user.id)


@router.put("/me/meta", response_model=UserMetaResponse)
async def update_my_meta(
    meta_in: UserMetaUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Update current user's profile metadata.
    """
    return await UserService.update_user_meta(db, current_user.id, meta_in.model_dump(exclude_unset=True))


@router.post("/me/avatar", response_model=UserMetaResponse)
async def upload_avatar(
    current_user: User = Depends(get_current_active_user),
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
):
    """
    Upload user avatar image.
    """
    # Validate file type
    if file.content_type not in ["image/jpeg", "image/png", "image/webp"]:
        raise HTTPException(status_code=400, detail="Invalid image format. Allowed: jpeg, png, webp")
    
    # Validate file size (5MB limit)
    MAX_FILE_SIZE = 5 * 1024 * 1024 # 5MB
    file.file.seek(0, 2)
    file_size = file.file.tell()
    file.file.seek(0)
    
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large. Max size is 5MB")
    
    # Create avatar directory if not exists
    avatars_dir = os.path.join(settings.UPLOADS_DIR, "avatars")
    os.makedirs(avatars_dir, exist_ok=True)
    
    # Save file
    safe_filename = "".join(c for c in file.filename if c.isalnum() or c in "._-")
    filename = f"{current_user.id}_{int(time.time())}_{safe_filename}"
    file_path = os.path.join(avatars_dir, filename)
    
    async with aiofiles.open(file_path, 'wb') as out_file:
        content = await file.read()
        await out_file.write(content)
        
    # Generate URL (assuming mounted at /uploads)
    avatar_url = f"/uploads/avatars/{filename}"
    
    # Update UserMeta
    return await UserService.update_user_meta(db, current_user.id, {"avatar_image": avatar_url})


@router.get("/ranking", response_model=list[UserRankingResponse])
async def get_ranking(
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
):
    """
    Get global user ranking (Top 50 by ball).
    """
    return await UserService.get_user_ranking(db, limit)


@router.get("/u/{username}", response_model=UserMetaResponse)
async def get_public_profile(
    username: str,
    db: AsyncSession = Depends(get_db),
):
    """
    Get public user profile by username/nickname.
    """
    meta = await UserService.get_user_meta_by_username(db, username)
    if not meta:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return meta


@router.delete("/me", status_code=status.HTTP_204_NO_CONTENT)
async def delete_current_user(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
) -> None:
    """
    Delete current user account
    
    This action is irreversible!
    
    Requires verified account
    """
    success = await UserService.delete_user(db, current_user.id)
    
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )


@router.get("/top-authors")
async def get_top_authors(
    limit: int = 5,
    db: AsyncSession = Depends(get_db)
):
    """
    Get top authors by contribution (public)
    """
    return await UserService.get_top_authors(db, limit)
