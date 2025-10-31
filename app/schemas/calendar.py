"""Schemas for calendar view responses."""
from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class CalendarEvent(BaseModel):
    """Represents an event returned by the calendar endpoint."""

    id: int
    title: str
    start: datetime
    end: Optional[datetime] = None
    contact_name: Optional[str] = None
    description: Optional[str] = None
