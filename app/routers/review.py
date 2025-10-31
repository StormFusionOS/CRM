"""Routes for review queue and change log approvals."""
from __future__ import annotations

from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import RoleEnum
from app.dependencies import get_current_user, get_db, require_roles
from app import models
from app.schemas import review as review_schemas


router = APIRouter(prefix="/api/review", tags=["review"], dependencies=[Depends(require_roles(RoleEnum.admin, RoleEnum.tech))])


@router.get("", response_model=List[review_schemas.ChangeLogRead])
def list_change_logs(db: Session = Depends(get_db)) -> List[models.ChangeLog]:
    """Return change log entries pending review."""

    return db.query(models.ChangeLog).order_by(models.ChangeLog.created_at.desc()).all()


@router.post("/{change_id}/action", response_model=review_schemas.ChangeLogRead)
def update_change_log(
    change_id: int,
    payload: review_schemas.ChangeLogAction,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
) -> models.ChangeLog:
    """Approve or reject change log entries."""

    change_log = db.get(models.ChangeLog, change_id)
    if change_log is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Change log entry not found")
    if payload.action not in {models.ChangeLogStatus.approved, models.ChangeLogStatus.rejected}:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid action")
    change_log.status = payload.action
    change_log.approved_by_id = current_user.id
    change_log.approved_at = datetime.utcnow()
    db.add(change_log)
    db.commit()
    db.refresh(change_log)
    return change_log
