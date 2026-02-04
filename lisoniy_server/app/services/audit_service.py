"""Audit logging service for terminology operations"""

import json
from datetime import datetime
from typing import Optional, List
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.terminology import TermAuditLog, AuditAction


class AuditService:
    """Service for managing audit logs"""
    
    @staticmethod
    async def log_action(
        db: AsyncSession,
        term_id: UUID,
        user_id: Optional[int],
        action: AuditAction,
        changes: Optional[dict] = None
    ) -> TermAuditLog:
        """
        Log an action on a term
        
        Args:
            db: Database session
            term_id: Term UUID
            user_id: User ID performing the action
            action: Action type (CREATE, UPDATE, DELETE)
            changes: Optional dictionary of changes
            
        Returns:
            Created audit log entry
        """
        audit_log = TermAuditLog(
            term_id=term_id,
            user_id=user_id,
            action=action,
            changes=json.dumps(changes) if changes else None,
            timestamp=datetime.utcnow()
        )
        
        db.add(audit_log)
        await db.flush()
        
        return audit_log
    
    @staticmethod
    async def get_term_history(
        db: AsyncSession,
        term_id: UUID
    ) -> List[TermAuditLog]:
        """
        Get audit history for a term
        
        Args:
            db: Database session
            term_id: Term UUID
            
        Returns:
            List of audit log entries
        """
        result = await db.execute(
            select(TermAuditLog)
            .where(TermAuditLog.term_id == term_id)
            .order_by(TermAuditLog.timestamp.desc())
        )
        
        return list(result.scalars().all())
