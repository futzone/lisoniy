"""Dataset metadata and interaction tracking models"""

from datetime import datetime
from typing import Optional
from uuid import UUID

from sqlalchemy import String, Text, Integer, BigInteger, DateTime, ForeignKey, UniqueConstraint, Index
from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.db.base import Base


class DatasetMeta(Base):
    """Dataset metadata for tracking stats, documentation, and license info"""
    
    __tablename__ = "dataset_meta"
    
    # Primary Key (same as dataset_id, one-to-one relationship)
    dataset_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        ForeignKey("datasets.id", ondelete="CASCADE"),
        primary_key=True,
        index=True
    )
    
    # Statistics
    stars_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    downloads_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    views_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    size_bytes: Mapped[int] = mapped_column(BigInteger, default=0, nullable=False)
    
    # Documentation
    readme: Mapped[Optional[str]] = mapped_column(Text, nullable=True, comment="Markdown README content")
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True, comment="Extended description")
    
    # License Information
    license_type: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, comment="License type (e.g., MIT, Apache-2.0)")
    license_text: Mapped[Optional[str]] = mapped_column(Text, nullable=True, comment="Full license text")
    
    # Last Update Tracking
    last_updated_user_id: Mapped[Optional[int]] = mapped_column(
        Integer,
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
        comment="User who last updated the dataset"
    )
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        server_default=func.now(),
        onupdate=func.now()
    )
    
    # Relationships
    dataset: Mapped[Optional["Dataset"]] = relationship(
        "Dataset",
        back_populates="meta",
        lazy="noload"
    )
    last_updated_by: Mapped[Optional["User"]] = relationship(
        "User",
        foreign_keys=[last_updated_user_id],
        lazy="noload"
    )
    
    # Indexes
    __table_args__ = (
        Index("ix_dataset_meta_stars_count", "stars_count"),
        Index("ix_dataset_meta_downloads_count", "downloads_count"),
    )


class DatasetStar(Base):
    """User stars/favorites for datasets"""
    
    __tablename__ = "dataset_stars"
    
    # Primary Key
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    
    # Foreign Keys
    dataset_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        ForeignKey("datasets.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    
    # Timestamp
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        server_default=func.now()
    )
    
    # Relationships
    dataset: Mapped[Optional["Dataset"]] = relationship(
        "Dataset",
        lazy="noload"
    )
    user: Mapped[Optional["User"]] = relationship(
        "User",
        lazy="noload"
    )
    
    # Constraints & Indexes
    __table_args__ = (
        UniqueConstraint("dataset_id", "user_id", name="uq_dataset_star"),
        Index("ix_dataset_stars_user_created", "user_id", "created_at"),
    )


class DatasetContributor(Base):
    """Track users who have contributed to a dataset"""
    
    __tablename__ = "dataset_contributors"
    
    # Primary Key
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    
    # Foreign Keys
    dataset_id: Mapped[UUID] = mapped_column(
        PGUUID(as_uuid=True),
        ForeignKey("datasets.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    
    # Contribution Stats
    contribution_count: Mapped[int] = mapped_column(
        Integer,
        default=1,
        nullable=False,
        comment="Number of times this user has contributed"
    )
    
    # Timestamps
    first_contribution_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        server_default=func.now()
    )
    last_contribution_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False,
        server_default=func.now(),
        onupdate=func.now()
    )
    
    # Relationships
    dataset: Mapped[Optional["Dataset"]] = relationship(
        "Dataset",
        lazy="noload"
    )
    user: Mapped[Optional["User"]] = relationship(
        "User",
        lazy="noload"
    )
    
    # Constraints & Indexes
    __table_args__ = (
        UniqueConstraint("dataset_id", "user_id", name="uq_dataset_contributor"),
        Index("ix_dataset_contributors_last_contribution", "dataset_id", "last_contribution_at"),
    )
