"""Post database model"""
from enum import Enum as PyEnum
from typing import TYPE_CHECKING, List
from sqlalchemy import String, Text, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base, TimestampMixin

if TYPE_CHECKING:
    from .user import User  # noqa
    from .comment import Comment  # noqa


class PostType(str, PyEnum):
    """Post type enumeration"""
    ARTICLE = "article"
    DISCUSSION = "discussion"


class Post(Base, TimestampMixin):
    """Post model for articles and discussions"""

    __tablename__ = "posts"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    type: Mapped[PostType] = mapped_column(String(50), nullable=False, default=PostType.DISCUSSION)
    files: Mapped[dict] = mapped_column(JSON, nullable=True)
    tags: Mapped[list] = mapped_column(JSON, nullable=True, default=list)

    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    owner: Mapped["User"] = relationship(back_populates="posts", lazy="noload")

    comments: Mapped[List["Comment"]] = relationship("Comment", back_populates="post", cascade="all, delete-orphan", lazy="noload")

    def to_dict(self):
        """Convert Post object to a dictionary for caching."""
        data = {
            "id": self.id,
            "title": self.title,
            "body": self.body,
            "type": self.type.value if hasattr(self.type, 'value') else self.type,
            "files": self.files,
            "tags": self.tags or [],
            "owner_id": self.owner_id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
        
        # Serialize owner if loaded
        if self.owner:
            data["owner"] = {
                "id": self.owner.id,
                "email": self.owner.email,
                "full_name": self.owner.full_name,
                "phone": self.owner.phone,
                "is_active": self.owner.is_active,
                "is_verified": self.owner.is_verified,
                "role": self.owner.role.value if hasattr(self.owner.role, 'value') else self.owner.role,
                "last_login": self.owner.last_login.isoformat() if self.owner.last_login else None,
                "created_at": self.owner.created_at.isoformat() if self.owner.created_at else None,
                "updated_at": self.owner.updated_at.isoformat() if self.owner.updated_at else None,
            }
            
        return data

    def __repr__(self) -> str:
        return f"<Post(id={self.id}, title={self.title}, type={self.type})>"
