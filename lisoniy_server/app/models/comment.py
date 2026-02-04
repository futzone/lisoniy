"""Comment database model"""
from typing import TYPE_CHECKING, List
from sqlalchemy import Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base, TimestampMixin

if TYPE_CHECKING:
    from .user import User
    from .post import Post


class Comment(Base, TimestampMixin):
    """Comment model for posts"""

    __tablename__ = "comments"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    body: Mapped[str] = mapped_column(Text, nullable=False)

    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    owner: Mapped["User"] = relationship(back_populates="comments", lazy="noload")

    post_id: Mapped[int] = mapped_column(ForeignKey("posts.id"))
    post: Mapped["Post"] = relationship(back_populates="comments", lazy="noload")

    parent_id: Mapped[int] = mapped_column(ForeignKey("comments.id"), nullable=True)
    parent: Mapped["Comment"] = relationship("Comment", remote_side=[id], back_populates="replies", lazy="noload")
    replies: Mapped[List["Comment"]] = relationship("Comment", back_populates="parent", cascade="all, delete-orphan", lazy="noload")

    def __repr__(self) -> str:
        return f"<Comment(id={self.id}, owner_id={self.owner_id}, post_id={self.post_id})>"
