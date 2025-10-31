"""Routes for inbox management."""
from __future__ import annotations

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import RoleEnum
from app.dependencies import get_db, require_roles
from app import models
from app.schemas import inbox as inbox_schemas
from app.tasks import tasks as task_queue


router = APIRouter(prefix="/api/inbox", tags=["inbox"], dependencies=[Depends(require_roles(RoleEnum.admin, RoleEnum.sales, RoleEnum.tech))])


@router.get("", response_model=List[inbox_schemas.InboxMessageRead])
def list_inbox_messages(db: Session = Depends(get_db)) -> List[models.InboxMessage]:
    """Return inbox messages sorted by most recent."""

    return db.query(models.InboxMessage).order_by(models.InboxMessage.received_at.desc()).all()


@router.post("", response_model=inbox_schemas.InboxMessageRead, status_code=status.HTTP_201_CREATED)
def create_inbox_message(payload: inbox_schemas.InboxMessageCreate, db: Session = Depends(get_db)) -> models.InboxMessage:
    """Create an inbox message entry (e.g., manual log)."""

    message = models.InboxMessage(**payload.model_dump())
    db.add(message)
    db.commit()
    db.refresh(message)
    return message


@router.post("/{message_id}/respond", status_code=status.HTTP_202_ACCEPTED)
def respond_to_message(message_id: int, payload: inbox_schemas.InboxResponse, db: Session = Depends(get_db)) -> dict:
    """Send a response to an inbox message using the appropriate communication channel."""

    message = db.get(models.InboxMessage, message_id)
    if message is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Message not found")
    if "@" in payload.to:
        task_queue.send_email.delay(payload.to, payload.subject or "", payload.message)
    else:
        task_queue.send_sms.delay(payload.to, payload.message)
    message.responded = True
    db.add(message)
    db.commit()
    return {"status": "queued"}
