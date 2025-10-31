"""Schemas for interaction resources."""
from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

from app.models import InteractionTypeEnum


class InteractionBase(BaseModel):
    """Base schema for interactions."""

    contact_id: Optional[int] = None
    lead_id: Optional[int] = None
    type: InteractionTypeEnum
    channel: Optional[str] = Field(default=None, max_length=255)
    timestamp: Optional[datetime] = None
    content: Optional[str] = None
    metadata: Optional[dict] = None


class InteractionCreate(InteractionBase):
    """Schema for creating interactions."""

    pass


class InteractionRead(InteractionBase):
    """Schema for reading interactions."""

    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
