"""Routes for managing leads."""
from __future__ import annotations

from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.security import RoleEnum
from app.dependencies import get_db, require_roles
from app import models
from app.schemas import leads as lead_schemas


router = APIRouter(prefix="/api/leads", tags=["leads"], dependencies=[Depends(require_roles(RoleEnum.admin, RoleEnum.sales, RoleEnum.tech))])


@router.get("", response_model=List[lead_schemas.LeadRead])
def list_leads(
    status_filter: Optional[models.LeadStatusEnum] = Query(default=None, alias="status"),
    stage: Optional[str] = Query(default=None),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=500),
    db: Session = Depends(get_db),
) -> List[models.Lead]:
    """Return leads filtered by status or stage."""

    query = db.query(models.Lead)
    if status_filter:
        query = query.filter(models.Lead.status == status_filter)
    if stage:
        query = query.filter(models.Lead.stage == stage)
    leads = query.offset(skip).limit(limit).all()
    return leads


@router.post("", response_model=lead_schemas.LeadRead, status_code=status.HTTP_201_CREATED)
def create_lead(payload: lead_schemas.LeadCreate, db: Session = Depends(get_db)) -> models.Lead:
    """Create a new lead with optional contact association."""

    data = payload.model_dump()
    contact = None
    if data.get("contact_id"):
        contact = db.get(models.Contact, data["contact_id"])
        if contact is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Associated contact not found")
    lead = models.Lead(**data)
    if contact:
        lead.contact = contact
    db.add(lead)
    db.commit()
    db.refresh(lead)
    return lead


@router.get("/{lead_id}", response_model=lead_schemas.LeadRead)
def get_lead(lead_id: int, db: Session = Depends(get_db)) -> models.Lead:
    """Retrieve a single lead."""

    lead = db.get(models.Lead, lead_id)
    if lead is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lead not found")
    return lead


@router.put("/{lead_id}", response_model=lead_schemas.LeadRead)
def update_lead(lead_id: int, payload: lead_schemas.LeadUpdate, db: Session = Depends(get_db)) -> models.Lead:
    """Update lead details."""

    lead = db.get(models.Lead, lead_id)
    if lead is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lead not found")
    data = payload.model_dump(exclude_unset=True)
    if "contact_id" in data and data["contact_id"]:
        contact = db.get(models.Contact, data["contact_id"])
        if contact is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Associated contact not found")
        lead.contact = contact
    for field, value in data.items():
        if field != "contact_id":
            setattr(lead, field, value)
    db.add(lead)
    db.commit()
    db.refresh(lead)
    return lead


@router.delete("/{lead_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_lead(lead_id: int, db: Session = Depends(get_db)) -> None:
    """Delete a lead."""

    lead = db.get(models.Lead, lead_id)
    if lead is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lead not found")
    db.delete(lead)
    db.commit()
