"""Schemas for inbox operations."""
from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

from app.models import InboxMessageDirection


class InboxMessageBase(BaseModel):
    """Base schema for inbox messages."""

    contact_id: Optional[int] = None
    lead_id: Optional[int] = None
    source: str = Field(..., max_length=255)
    direction: InboxMessageDirection
    subject: Optional[str] = None
    body: Optional[str] = None


class InboxMessageCreate(InboxMessageBase):
    """Schema for creating inbox messages."""

    pass


class InboxMessageRead(InboxMessageBase):
    """Schema for reading inbox messages."""

    id: int
    received_at: datetime
    responded: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class InboxResponse(BaseModel):
    """Schema for sending responses via inbox endpoints."""

    to: str
    subject: Optional[str] = None
    message: str
