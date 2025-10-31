"""Schemas for media file management."""
from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class MediaFileRead(BaseModel):
    """Represents stored media file metadata."""

    id: int
    file_path: str
    original_filename: Optional[str]
    owner_id: Optional[int]
    related_model: Optional[str]
    related_id: Optional[int]
    content_type: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
