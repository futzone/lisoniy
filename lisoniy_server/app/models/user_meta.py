"""User Meta database model"""

from sqlalchemy import String, Integer, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin

class UserMeta(Base, TimestampMixin):
    """User Meta model for extended profile information"""
    
    __tablename__ = "user_meta"
    
    # Primary Key
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    
    # Foreign Key
    user_id: Mapped[int] = mapped_column(
        Integer, 
        ForeignKey("users.id", ondelete="CASCADE"), 
        unique=True, 
        nullable=False,
        index=True
    )
    
    # Fields
    nickname: Mapped[str] = mapped_column(String(50), nullable=True, unique=True)
    address: Mapped[str] = mapped_column(String(255), nullable=True)
    github_url: Mapped[str] = mapped_column(String(255), nullable=True)
    telegram_url: Mapped[str] = mapped_column(String(255), nullable=True)
    website_url: Mapped[str] = mapped_column(String(255), nullable=True)
    education: Mapped[str] = mapped_column(String(255), nullable=True)
    bio: Mapped[str] = mapped_column(Text, nullable=True)
    avatar_image: Mapped[str] = mapped_column(String(500), nullable=True)
    
    # Stats Cache
    ball: Mapped[int] = mapped_column(Integer, default=0, nullable=False, index=True)
    
    # Relationship
    user: Mapped["User"] = relationship("User", back_populates="meta")

    def __repr__(self) -> str:
        return f"<UserMeta(user_id={self.user_id}, nickname={self.nickname})>"
