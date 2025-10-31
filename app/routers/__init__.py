"""Expose FastAPI routers for application modules."""
from __future__ import annotations

from . import (
    appointments,
    auth,
    calendar,
    campaigns,
    contacts,
    inbox,
    interactions,
    leads,
    logs,
    media,
    pipeline,
    review,
    users,
    webhooks,
)


__all__ = [
    "appointments",
    "auth",
    "calendar",
    "campaigns",
    "contacts",
    "inbox",
    "interactions",
    "leads",
    "logs",
    "media",
    "pipeline",
    "review",
    "users",
    "webhooks",
]
