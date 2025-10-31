"""Routes for managing contacts."""
from __future__ import annotations

from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.core.security import RoleEnum
from app.dependencies import get_db, require_roles
from app import models
from app.schemas import contacts as contact_schemas


router = APIRouter(prefix="/api/contacts", tags=["contacts"], dependencies=[Depends(require_roles(RoleEnum.admin, RoleEnum.sales, RoleEnum.tech))])


@router.get("", response_model=List[contact_schemas.ContactRead])
def list_contacts(
    search: Optional[str] = Query(default=None, description="Search by name, email, or phone"),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=500),
    db: Session = Depends(get_db),
) -> List[models.Contact]:
    """List contacts with optional search and pagination."""

    query = db.query(models.Contact)
    if search:
        wildcard = f"%{search.lower()}%"
        query = query.filter(
            or_(
                models.Contact.name.ilike(wildcard),
                models.Contact.email.ilike(wildcard),
                models.Contact.phone.ilike(wildcard),
            )
        )
    contacts = query.offset(skip).limit(limit).all()
    return contacts


@router.post("", response_model=contact_schemas.ContactRead, status_code=status.HTTP_201_CREATED)
def create_contact(payload: contact_schemas.ContactCreate, db: Session = Depends(get_db)) -> models.Contact:
    """Create a new contact record."""

    if payload.email and db.query(models.Contact).filter(models.Contact.email == payload.email).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already exists")
    if payload.phone and db.query(models.Contact).filter(models.Contact.phone == payload.phone).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Phone already exists")
    contact = models.Contact(**payload.model_dump())
    db.add(contact)
    db.commit()
    db.refresh(contact)
    return contact


@router.get("/{contact_id}", response_model=contact_schemas.ContactRead)
def get_contact(contact_id: int, db: Session = Depends(get_db)) -> models.Contact:
    """Retrieve a single contact by ID."""

    contact = db.get(models.Contact, contact_id)
    if contact is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contact not found")
    return contact


@router.put("/{contact_id}", response_model=contact_schemas.ContactRead)
def update_contact(contact_id: int, payload: contact_schemas.ContactUpdate, db: Session = Depends(get_db)) -> models.Contact:
    """Update an existing contact."""

    contact = db.get(models.Contact, contact_id)
    if contact is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contact not found")
    data = payload.model_dump(exclude_unset=True)
    if "email" in data and data["email"]:
        existing = db.query(models.Contact).filter(models.Contact.email == data["email"], models.Contact.id != contact_id).first()
        if existing:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already exists")
    if "phone" in data and data["phone"]:
        existing = db.query(models.Contact).filter(models.Contact.phone == data["phone"], models.Contact.id != contact_id).first()
        if existing:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Phone already exists")
    for field, value in data.items():
        setattr(contact, field, value)
    db.add(contact)
    db.commit()
    db.refresh(contact)
    return contact


@router.delete("/{contact_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_contact(contact_id: int, db: Session = Depends(get_db)) -> None:
    """Delete a contact."""

    contact = db.get(models.Contact, contact_id)
    if contact is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contact not found")
    db.delete(contact)
    db.commit()
