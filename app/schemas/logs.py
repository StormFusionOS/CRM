"""Schemas for log retrieval."""
from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class TaskLogRead(BaseModel):
    """Represents a task log entry."""

    id: int
    task_name: str
    status: str
    started_at: datetime
    finished_at: Optional[datetime]
    message: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
