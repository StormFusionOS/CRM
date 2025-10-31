"""Celery application configuration."""
from __future__ import annotations

from celery import Celery

from app.core.config import settings


celery_app = Celery(
    "crm",
    broker=settings.celery_broker_url,
    backend=settings.celery_result_backend or settings.celery_broker_url,
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)

celery_app.conf.beat_schedule = {
    "daily-database-backup": {
        "task": "app.tasks.tasks.perform_daily_backup",
        "schedule": 24 * 60 * 60,
    },
    "weekly-report-email": {
        "task": "app.tasks.tasks.send_weekly_report",
        "schedule": 7 * 24 * 60 * 60,
    },
}


celery_app.autodiscover_tasks(["app.tasks"])
