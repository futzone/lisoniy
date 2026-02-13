"""Dataset management models for AI training data storage"""

from datetime import datetime
from typing import Optional
from uuid import uuid4

from sqlalchemy import String, Text, Boolean, DateTime, ForeignKey, Index, Integer
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.db.base import Base


class Dataset(Base):
    """Dataset model for organizing AI training data"""
    
    __tablename__ = "datasets"
    
    # Primary Key
    id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid4
    )
    
    # Basic Info
    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    type: Mapped[str] = mapped_column(
        String(50), 
        nullable=False,
        index=True,
        comment="Dataset type: instruction, parallel, ner, legal_qa, etc."
    )
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Visibility
    is_public: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    
    # Creator
    creator_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
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
    entries: Mapped[list["DataEntry"]] = relationship(
        "DataEntry",
        back_populates="dataset",
        cascade="all, delete-orphan",
        lazy="noload"
    )
    creator: Mapped[Optional["User"]] = relationship(
        "User",
        foreign_keys=[creator_id],
        back_populates="datasets",
        lazy="noload"
    )
    # Use string for forward reference to avoid import issues
    meta: Mapped[Optional["DatasetMeta"]] = relationship(
        "DatasetMeta",
        back_populates="dataset",
        uselist=False,
        lazy="noload"
    )
    
    # Indexes
    __table_args__ = (
        Index("ix_datasets_type_public", "type", "is_public"),
        Index("ix_datasets_creator_type", "creator_id", "type"),
    )


class DataEntry(Base):
    """Data entry model for storing dataset items with polymorphic content"""
    
    __tablename__ = "data_entries"
    
    # Primary Key
    id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid4
    )
    
    # Dataset Reference
    dataset_id: Mapped[UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("datasets.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    
    # Polymorphic Content (JSONB)
    content: Mapped[dict] = mapped_column(
        JSONB,
        nullable=False,
        comment="Polymorphic content storage for different dataset types"
    )
    
    # Metadata (JSONB)
    entry_metadata: Mapped[Optional[dict]] = mapped_column(
        JSONB,
        name="metadata",  # Column name in database
        nullable=True,
        comment="Additional metadata (tags, source, etc.)"
    )
    
    # Hash Key for Deduplication
    hash_key: Mapped[str] = mapped_column(
        String(64),
        nullable=False,
        unique=True,
        index=True,
        comment="SHA256 hash of dataset_id + content for duplicate detection"
    )
    
    # Creator
    creator_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
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
        back_populates="entries",
        lazy="noload"
    )
    creator: Mapped[Optional["User"]] = relationship(
        "User",
        foreign_keys=[creator_id],
        lazy="noload"
    )
    
    # Indexes
    __table_args__ = (
        Index("ix_data_entries_dataset_created", "dataset_id", "created_at"),
        Index("ix_data_entries_content_gin", "content", postgresql_using="gin"),
    )
