"""User and RefreshToken database models"""

from datetime import datetime
from enum import Enum as PyEnum
from typing import Optional, TYPE_CHECKING

from sqlalchemy import String, Boolean, Integer, DateTime, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin

if TYPE_CHECKING:
    from .post import Post  # noqa
    from .comment import Comment  # noqa
    from .user_meta import UserMeta # noqa
    from .dataset import Dataset # noqa


class UserRole(str, PyEnum):
    """User role enumeration"""
    USER = "user"
    ADMIN = "admin"


class User(Base, TimestampMixin):
    """User model for authentication and profile management"""
    
    __tablename__ = "users"
    
    # Primary Key
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    
    # Authentication
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    
    # Profile Information
    full_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    phone: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    
    # Status & Verification
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    
    # Role (using String to avoid PostgreSQL ENUM complications)
    role: Mapped[str] = mapped_column(
        String(20),
        default=UserRole.USER.value,
        nullable=False
    )
    
    # Last Login
    last_login: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    
    # Relationships
    refresh_tokens: Mapped[list["RefreshToken"]] = relationship(
        "RefreshToken",
        back_populates="user",
        cascade="all, delete-orphan"
    )
    posts: Mapped[list["Post"]] = relationship("Post", back_populates="owner", cascade="all, delete-orphan", lazy="noload")
    comments: Mapped[list["Comment"]] = relationship("Comment", back_populates="owner", cascade="all, delete-orphan", lazy="noload")
    datasets: Mapped[list["Dataset"]] = relationship("Dataset", back_populates="creator", cascade="all, delete-orphan", lazy="noload")
    meta: Mapped["UserMeta"] = relationship("UserMeta", back_populates="user", uselist=False, cascade="all, delete-orphan", lazy="selectin")
    
    def __repr__(self) -> str:
        return f"<User(id={self.id}, email={self.email}, role={self.role})>"


class RefreshToken(Base, TimestampMixin):
    """Refresh token model for token management"""
    
    __tablename__ = "refresh_tokens"
    
    # Primary Key
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    
    # Token
    token: Mapped[str] = mapped_column(String(500), unique=True, index=True, nullable=False)
    
    # User relationship
    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )
    
    # Expiration
    expires_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    
    # Revocation
    is_revoked: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    
    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="refresh_tokens")
    
    def __repr__(self) -> str:
        return f"<RefreshToken(id={self.id}, user_id={self.user_id}, revoked={self.is_revoked})>"
