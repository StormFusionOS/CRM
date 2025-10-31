"""Pydantic schemas for contact resources."""
from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class ContactBase(BaseModel):
    """Base schema for contacts."""

    name: str = Field(..., max_length=255)
    email: Optional[EmailStr] = Field(default=None)
    phone: Optional[str] = Field(default=None, max_length=32)
    company: Optional[str] = Field(default=None, max_length=255)
    notes: Optional[str] = None


class ContactCreate(ContactBase):
    """Schema for creating contacts."""

    pass


class ContactUpdate(BaseModel):
    """Schema for updating contacts."""

    name: Optional[str] = Field(default=None, max_length=255)
    email: Optional[EmailStr] = Field(default=None)
    phone: Optional[str] = Field(default=None, max_length=32)
    company: Optional[str] = Field(default=None, max_length=255)
    notes: Optional[str] = None


class ContactRead(ContactBase):
    """Schema for reading contacts."""

    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
