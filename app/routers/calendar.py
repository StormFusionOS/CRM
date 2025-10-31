"""Routes providing calendar data."""
from __future__ import annotations

from datetime import datetime, timedelta
from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_current_user, get_db
from app import models
from app.schemas import calendar as calendar_schemas


router = APIRouter(prefix="/api/calendar", tags=["calendar"])


@router.get("/events", response_model=List[calendar_schemas.CalendarEvent])
def upcoming_events(
    days: int = 30,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
) -> List[calendar_schemas.CalendarEvent]:
    """Return upcoming appointments for calendar integration."""

    now = datetime.utcnow()
    horizon = now + timedelta(days=days)
    query = db.query(models.Appointment).join(models.Contact).filter(models.Appointment.scheduled_time.between(now, horizon))
    events: List[calendar_schemas.CalendarEvent] = []
    for appointment in query.all():
        events.append(
            calendar_schemas.CalendarEvent(
                id=appointment.id,
                title=f"Meeting with {appointment.contact.name}",
                start=appointment.scheduled_time,
                contact_name=appointment.contact.name if appointment.contact else None,
                description=appointment.description,
            )
        )
    return events
