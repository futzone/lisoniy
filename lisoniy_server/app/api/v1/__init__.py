"""API v1 router setup"""

from fastapi import APIRouter

from app.api.v1 import (
    admin,
    auth,
    users,
    categories,
    terms,
    search,
    comments,
    posts,
    datasets,
    entries,
    dataset_meta,
    seo
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
api_router.include_router(categories.router, prefix="/categories", tags=["categories"])
api_router.include_router(terms.router, prefix="/terms", tags=["terms"])
api_router.include_router(search.router, tags=["search"])
api_router.include_router(posts.router, prefix="/posts", tags=["posts"])
api_router.include_router(comments.router, prefix="/comments", tags=["comments"])
api_router.include_router(datasets.router, tags=["datasets"])
api_router.include_router(entries.router, tags=["entries"])
api_router.include_router(dataset_meta.router, tags=["dataset-meta"])
api_router.include_router(seo.router, tags=["seo"])

__all__ = ["api_router"]
