"""Pydantic schemas for lead resources."""
from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

from app.models import LeadStatusEnum


class LeadBase(BaseModel):
    """Base schema for leads."""

    contact_id: Optional[int] = Field(default=None)
    source: Optional[str] = Field(default=None, max_length=255)
    status: LeadStatusEnum = LeadStatusEnum.new
    stage: Optional[str] = Field(default=None, max_length=255)
    value: Optional[float] = Field(default=None)
    notes: Optional[str] = None


class LeadCreate(LeadBase):
    """Schema for creating leads."""

    pass


class LeadUpdate(BaseModel):
    """Schema for updating leads."""

    contact_id: Optional[int] = Field(default=None)
    source: Optional[str] = Field(default=None, max_length=255)
    status: Optional[LeadStatusEnum] = None
    stage: Optional[str] = Field(default=None, max_length=255)
    value: Optional[float] = Field(default=None)
    notes: Optional[str] = None


class LeadRead(LeadBase):
    """Schema for reading leads."""

    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
