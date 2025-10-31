"""Routes for managing appointments."""
from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.security import RoleEnum
from app.dependencies import get_db, require_roles
from app import models
from app.schemas import appointments as appointment_schemas


router = APIRouter(prefix="/api/appointments", tags=["appointments"], dependencies=[Depends(require_roles(RoleEnum.admin, RoleEnum.sales, RoleEnum.tech))])


@router.get("", response_model=List[appointment_schemas.AppointmentRead])
def list_appointments(
    contact_id: Optional[int] = Query(default=None),
    upcoming: bool = Query(default=False),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=500),
    db: Session = Depends(get_db),
) -> List[models.Appointment]:
    """List appointments with optional filters."""

    query = db.query(models.Appointment)
    if contact_id:
        query = query.filter(models.Appointment.contact_id == contact_id)
    if upcoming:
        query = query.filter(models.Appointment.scheduled_time >= datetime.utcnow())
    appointments = query.order_by(models.Appointment.scheduled_time.asc()).offset(skip).limit(limit).all()
    return appointments


@router.post("", response_model=appointment_schemas.AppointmentRead, status_code=status.HTTP_201_CREATED)
def create_appointment(payload: appointment_schemas.AppointmentCreate, db: Session = Depends(get_db)) -> models.Appointment:
    """Create a new appointment."""

    contact = db.get(models.Contact, payload.contact_id)
    if contact is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contact not found")
    appointment = models.Appointment(**payload.model_dump())
    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    return appointment


@router.put("/{appointment_id}", response_model=appointment_schemas.AppointmentRead)
def update_appointment(appointment_id: int, payload: appointment_schemas.AppointmentUpdate, db: Session = Depends(get_db)) -> models.Appointment:
    """Update appointment details."""

    appointment = db.get(models.Appointment, appointment_id)
    if appointment is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found")
    data = payload.model_dump(exclude_unset=True)
    for field, value in data.items():
        setattr(appointment, field, value)
    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    return appointment


@router.delete("/{appointment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_appointment(appointment_id: int, db: Session = Depends(get_db)) -> None:
    """Delete an appointment."""

    appointment = db.get(models.Appointment, appointment_id)
    if appointment is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found")
    db.delete(appointment)
    db.commit()
