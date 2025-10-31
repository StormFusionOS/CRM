"""Schemas for review queue and change log operations."""
from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

from app.models import ChangeLogStatus


class ChangeLogRead(BaseModel):
    """Represents a change log entry."""

    id: int
    entity_type: str
    entity_id: Optional[int]
    change_summary: str
    status: ChangeLogStatus
    created_at: datetime
    updated_at: datetime
    approved_at: Optional[datetime]

    class Config:
        from_attributes = True


class ChangeLogAction(BaseModel):
    """Payload to approve or reject a change log entry."""

    action: ChangeLogStatus = Field(..., description="New status, must be approved or rejected")
    comment: Optional[str] = None
