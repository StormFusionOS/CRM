"""Task package exposing Celery task modules."""
from __future__ import annotations

from .celery_app import celery_app

__all__ = ["celery_app"]
