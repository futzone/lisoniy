"""API endpoints for posts"""
from typing import List, Optional
from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
    UploadFile,
    File,
    Form,
    Query,
)
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models import User, PostType
from app.schemas.content import (
    PostCreate,
    PostResponse,
    PostWithCommentsResponse,
    PostUpdate,
)
from app.services import PostService, CommentService
from app.core.dependencies import get_current_active_user, get_current_user_optional
from app.models.post import Post # Import Post model for type hinting in _populate_post_response

router = APIRouter()


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_post(
    title: str = Form(...),
    body: str = Form(...),
    type: PostType = Form(PostType.DISCUSSION),
    tags: Optional[str] = Form(None, description="Comma-separated tags (e.g., 'python,fastapi,api' or '#python,#fastapi')"),
    files: List[UploadFile] = File(None),
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Create a new post. Supports multipart/form-data for file uploads.
    
    Form fields:
    - title: Post title
    - body: Post content
    - type: 'article' or 'discussion'
    - tags: Comma-separated tags (optional, e.g., 'python,fastapi' or '#python,#fastapi')
    - files: Multiple file uploads (optional)
    
    Returns:
    - {"id": <post_id>}
    """
    try:
        # Parse tags from comma-separated string
        tag_list = []
        if tags:
            tag_list = [tag.strip() for tag in tags.split(',') if tag.strip()]
        
        post_data = PostCreate(title=title, body=body, type=type, tags=tag_list)
        post = await PostService.create_post(db, post_data, current_user, files)
        return {"id": post.id}
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/", response_model=List[PostResponse])
async def get_posts(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    type: Optional[PostType] = Query(None),
    tag: Optional[str] = Query(None, description="Filter by tag (e.g., 'python' or '#python')"),
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    """
    Get a list of posts with pagination and optional filtering by type and tags.
    """
    posts, _ = await PostService.get_all_posts(db, skip, limit, type, tag)
    return [await _populate_post_response(db, post, current_user) for post in posts]


@router.get("/{post_id}", response_model=PostWithCommentsResponse)
async def get_post_details(
    post_id: int, 
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional),
):
    """
    Get a single post by its ID, including its full comment tree.
    """
    post = await PostService.get_post(db, post_id)
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")

    comments = await CommentService.get_comments_for_post(db, post_id)
    comment_tree = CommentService.build_comment_tree(comments)
    
    post_response = await _populate_post_response(db, post, current_user)
    
    return PostWithCommentsResponse(
        **post_response.model_dump(),
        comments=comment_tree
    )


@router.put("/{post_id}", response_model=PostResponse)
async def update_post(
    post_id: int,
    post_data: PostUpdate,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Update a post. Only the owner of the post can perform this action.
    """
    updated_post = await PostService.update_post(db, post_id, post_data, current_user)
    if not updated_post:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized or post not found")
    return await _populate_post_response(db, updated_post, current_user)


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(
    post_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Delete a post. Only the owner of the post can perform this action.
    """
    success = await PostService.delete_post(db, post_id, current_user)
    if not success:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized or post not found")


@router.post("/{post_id}/like", status_code=status.HTTP_204_NO_CONTENT)
async def like_post(
    post_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Like a post (toggle).
    """
    try:
        post = await PostService.get_post(db, post_id)
        if not post:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
        await PostService.like_post(post_id, current_user.id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to like post: {str(e)}")


@router.delete("/{post_id}/like", status_code=status.HTTP_204_NO_CONTENT)
async def unlike_post(
    post_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Unlike a post (explicit).
    """
    try:
        post = await PostService.get_post(db, post_id)
        if not post:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")
        await PostService.unlike_post(post_id, current_user.id)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to unlike post: {str(e)}")


@router.get("/tags/popular", response_model=List[dict])
async def get_popular_tags(
    limit: int = Query(10, ge=1, le=50, description="Number of top tags to return"),
    db: AsyncSession = Depends(get_db),
):
    """
    Get the most used tags with their post counts.
    """
    tags = await PostService.get_popular_tags(db, limit)
    return tags


async def _populate_post_response(db: AsyncSession, post: Post, current_user: Optional[User] = None) -> PostResponse:
    """
    Helper to combine DB data with Redis metrics and DB counts for a PostResponse.
    Includes error handling for Redis to prevent API failure.
    """
    try:
        metrics = await PostService.get_post_metrics(post.id)
        total_likes = metrics["total_likes"]
        total_views = metrics["total_views"]
        
        # Fetch comment count from DB
        total_comments = await CommentService.get_comment_count(db, post.id)
        
        is_liked = False
        if current_user:
            is_liked = await PostService.is_post_liked(post.id, current_user.id)
            
        # Manually extract owner data safely
        owner_data = None
        if post.owner:
            owner_data = {
                "id": post.owner.id,
                "email": post.owner.email,
                "full_name": post.owner.full_name,
                "phone": post.owner.phone,
                "role": post.owner.role.value if hasattr(post.owner.role, 'value') else post.owner.role,
                "is_active": post.owner.is_active,
                "is_verified": post.owner.is_verified,
                "last_login": post.owner.last_login,
                "created_at": post.owner.created_at,
                "updated_at": post.owner.updated_at,
            }
        
        # Build post data dict manually to be 100% sure no lazy loading/circularity happens
        post_data = {
            "id": post.id,
            "title": post.title,
            "body": post.body,
            "type": post.type.value if hasattr(post.type, 'value') else post.type,
            "owner_id": post.owner_id,
            "owner": owner_data,
            "created_at": post.created_at,
            "updated_at": post.updated_at,
            "files": post.files or [],
            "tags": post.tags or [],
            "total_likes": total_likes,
            "total_views": total_views,
            "total_comments": total_comments,
            "is_liked": bool(is_liked)
        }
        
        return PostResponse.model_validate(post_data)
            
    except Exception as e:
        print(f"CRITICAL ERROR in _populate_post_response for post {post.id}: {e}")
        import traceback
        traceback.print_exc()
        # Bare minimum fallback
        return PostResponse(
            id=post.id,
            title=post.title,
            body=post.body,
            type=post.type if hasattr(post.type, 'value') else post.type,
            owner_id=post.owner_id,
            owner=UserResponse.model_validate({
                "id": post.owner.id,
                "email": post.owner.email,
                "full_name": post.owner.full_name,
                "role": post.owner.role.value if hasattr(post.owner.role, 'value') else post.owner.role,
                "is_active": post.owner.is_active,
                "is_verified": post.owner.is_verified,
                "created_at": post.owner.created_at,
                "updated_at": post.owner.updated_at,
            }) if post.owner else None,
            created_at=post.created_at,
            updated_at=post.updated_at,
            total_likes=0,
            total_views=0,
            total_comments=0,
            is_liked=False
        )
