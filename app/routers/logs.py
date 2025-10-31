"""Routes for retrieving system logs."""
from __future__ import annotations

from typing import List

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.security import RoleEnum
from app.dependencies import get_db, require_roles
from app import models
from app.schemas import logs as log_schemas


router = APIRouter(prefix="/api/logs", tags=["logs"], dependencies=[Depends(require_roles(RoleEnum.admin))])


@router.get("/tasks", response_model=List[log_schemas.TaskLogRead])
def list_task_logs(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=500),
    db: Session = Depends(get_db),
) -> List[models.TaskLog]:
    """Return Celery task logs with pagination."""

    query = db.query(models.TaskLog).order_by(models.TaskLog.created_at.desc())
    return query.offset(skip).limit(limit).all()
