"""Terminology/Dictionary database models"""

from datetime import datetime
from enum import Enum as PyEnum
from typing import Optional
import uuid

from sqlalchemy import String, Boolean, Text, DateTime, ForeignKey, Enum, Integer, Index
from sqlalchemy.dialects.postgresql import UUID, TSVECTOR
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin


class AuditAction(str, PyEnum):
    """Audit action enumeration"""
    create = "create"
    update = "update"
    delete = "delete"


class Category(Base, TimestampMixin):
    """Category model for organizing terms"""
    
    __tablename__ = "categories"
    
    # Primary Key
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        index=True
    )
    
    # Fields
    slug: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        index=True,
        nullable=False
    )
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Relationships
    terms: Mapped[list["Term"]] = relationship(
        "Term",
        back_populates="category",
        cascade="all, delete-orphan"
    )
    
    def __repr__(self) -> str:
        return f"<Category(id={self.id}, slug={self.slug}, name={self.name})>"


class Term(Base, TimestampMixin):
    """Term model - main terminology table"""
    
    __tablename__ = "terms"
    
    # Primary Key
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        index=True
    )
    
    # Fields
    keyword: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=False
    )
    
    # Foreign Keys
    category_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("categories.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    
    creator_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True
    )
    
    # Soft Delete
    is_deleted: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    deleted_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    deleted_by: Mapped[Optional[int]] = mapped_column(
        Integer,
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True
    )
    
    # Relationships
    category: Mapped["Category"] = relationship("Category", back_populates="terms")
    creator: Mapped["User"] = relationship("User", foreign_keys=[creator_id])
    definitions: Mapped[list["Definition"]] = relationship(
        "Definition",
        back_populates="term",
        cascade="all, delete-orphan"
    )
    audit_logs: Mapped[list["TermAuditLog"]] = relationship(
        "TermAuditLog",
        back_populates="term",
        cascade="all, delete-orphan"
    )
    
    def __repr__(self) -> str:
        return f"<Term(id={self.id}, keyword={self.keyword}, deleted={self.is_deleted})>"


class Definition(Base, TimestampMixin):
    """Definition model - translations and explanations for terms"""
    
    __tablename__ = "definitions"
    
    # Primary Key
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        index=True
    )
    
    # Foreign Keys
    term_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("terms.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    
    # Fields
    language: Mapped[str] = mapped_column(String(2), nullable=False)  # ISO 639-1
    text: Mapped[str] = mapped_column(Text, nullable=False)
    example: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    is_approved: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    
    # Full-text search
    search_vector: Mapped[Optional[str]] = mapped_column(
        TSVECTOR,
        nullable=True
    )
    
    # Relationships
    term: Mapped["Term"] = relationship("Term", back_populates="definitions")
    
    __table_args__ = (
        Index("idx_definitions_language", "language"),
        Index("idx_definitions_search_vector", "search_vector", postgresql_using="gin"),
    )
    
    def __repr__(self) -> str:
        return f"<Definition(id={self.id}, term_id={self.term_id}, language={self.language})>"


class TermAuditLog(Base):
    """Audit log for term operations"""
    
    __tablename__ = "term_audit_logs"
    
    # Primary Key
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        index=True
    )
    
    # Foreign Keys
    term_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("terms.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    
    user_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True
    )
    
    # Fields
    action: Mapped[AuditAction] = mapped_column(
        Enum(AuditAction),
        nullable=False
    )
    changes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)  # JSON string
    timestamp: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
        index=True
    )
    
    # Relationships
    term: Mapped["Term"] = relationship("Term", back_populates="audit_logs")
    
    def __repr__(self) -> str:
        return f"<TermAuditLog(id={self.id}, term_id={self.term_id}, action={self.action})>"
