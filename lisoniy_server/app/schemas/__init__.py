"""Schemas module initialization"""

from app.schemas.user import (
    UserBase,
    UserCreate,
    UserUpdate,
    UserResponse,
    UserInDB,
    AdminUserUpdate,
)
from app.schemas.auth import (
    LoginRequest,
    RegisterRequest,
    VerifyEmailRequest,
    RequestPasswordResetRequest,
    ResetPasswordRequest,
    ChangePasswordRequest,
)
from app.schemas.token import (
    TokenResponse,
    RefreshTokenRequest,
    AccessTokenResponse,
)
from app.schemas.terminology import (
    CategoryCreate,
    CategoryUpdate,
    CategoryResponse,
    DefinitionCreate,
    DefinitionUpdate,
    DefinitionResponse,
    TermCreate,
    TermUpdate,
    TermResponse,
    TermDetailResponse,
    BulkTermCreate,
    BulkTermDelete,
    BulkOperationResponse,
    SearchQuery,
    SearchResponse,
    AuditLogResponse,
)
from app.schemas.content import (
    PostBase,
    PostCreate,
    PostUpdate,
    PostResponse,
    PostWithCommentsResponse,
    CommentBase,
    CommentCreate,
    CommentResponse,
    CommentWithRepliesResponse,
)

__all__ = [
    # User schemas
    "UserBase",
    "UserCreate",
    "UserUpdate",
    "UserResponse",
    "UserInDB",
    "AdminUserUpdate",
    # Auth schemas
    "LoginRequest",
    "RegisterRequest",
    "VerifyEmailRequest",
    "RequestPasswordResetRequest",
    "ResetPasswordRequest",
    "ChangePasswordRequest",
    # Token schemas
    "TokenResponse",
    "RefreshTokenRequest",
    "AccessTokenResponse",
    # Terminology schemas
    "CategoryCreate",
    "CategoryUpdate",
    "CategoryResponse",
    "DefinitionCreate",
    "DefinitionUpdate",
    "DefinitionResponse",
    "TermCreate",
    "TermUpdate",
    "TermResponse",
    "TermDetailResponse",
    "BulkTermCreate",
    "BulkTermDelete",
    "BulkOperationResponse",
    "SearchQuery",
    "SearchResponse",
    "AuditLogResponse",
    # Content schemas
    "PostBase",
    "PostCreate",
    "PostUpdate",
    "PostResponse",
    "PostWithCommentsResponse",
    "CommentBase",
    "CommentCreate",
    "CommentResponse",
    "CommentWithRepliesResponse",
]

