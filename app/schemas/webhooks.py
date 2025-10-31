"""Schemas for webhook processing."""
from __future__ import annotations

from datetime import datetime
from typing import Any, Dict, Optional

from pydantic import BaseModel


class WebhookLogRead(BaseModel):
    """Represents webhook log entries."""

    id: int
    source: str
    headers: Optional[Dict[str, Any]]
    payload: Optional[Dict[str, Any]]
    status: Optional[str]
    details: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
