"""Schemas for appointment resources."""
from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

from app.models import AppointmentStatusEnum


class AppointmentBase(BaseModel):
    """Base schema for appointments."""

    contact_id: int
    scheduled_time: datetime
    description: Optional[str] = None
    status: AppointmentStatusEnum = AppointmentStatusEnum.scheduled


class AppointmentCreate(AppointmentBase):
    """Schema for creating appointments."""

    pass


class AppointmentUpdate(BaseModel):
    """Schema for updating appointments."""

    scheduled_time: Optional[datetime] = None
    description: Optional[str] = None
    status: Optional[AppointmentStatusEnum] = None


class AppointmentRead(AppointmentBase):
    """Schema for reading appointments."""

    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
