"""Routes for interaction logging."""
from __future__ import annotations

from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.security import RoleEnum
from app.dependencies import get_db, require_roles
from app import models
from app.schemas import interactions as interaction_schemas


router = APIRouter(prefix="/api/interactions", tags=["interactions"], dependencies=[Depends(require_roles(RoleEnum.admin, RoleEnum.sales, RoleEnum.tech))])


@router.get("", response_model=List[interaction_schemas.InteractionRead])
def list_interactions(
    contact_id: Optional[int] = Query(default=None),
    lead_id: Optional[int] = Query(default=None),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=500),
    db: Session = Depends(get_db),
) -> List[models.Interaction]:
    """List interactions filtered by contact or lead."""

    query = db.query(models.Interaction)
    if contact_id:
        query = query.filter(models.Interaction.contact_id == contact_id)
    if lead_id:
        query = query.filter(models.Interaction.lead_id == lead_id)
    interactions = query.order_by(models.Interaction.timestamp.desc()).offset(skip).limit(limit).all()
    return interactions


@router.post("", response_model=interaction_schemas.InteractionRead, status_code=status.HTTP_201_CREATED)
def create_interaction(payload: interaction_schemas.InteractionCreate, db: Session = Depends(get_db)) -> models.Interaction:
    """Create a new interaction entry."""

    data = payload.model_dump()
    if data.get("contact_id") and db.get(models.Contact, data["contact_id"]) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contact not found")
    if data.get("lead_id") and db.get(models.Lead, data["lead_id"]) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lead not found")
    interaction = models.Interaction(**data)
    db.add(interaction)
    db.commit()
    db.refresh(interaction)
    return interaction


@router.get("/{interaction_id}", response_model=interaction_schemas.InteractionRead)
def get_interaction(interaction_id: int, db: Session = Depends(get_db)) -> models.Interaction:
    """Retrieve a single interaction."""

    interaction = db.get(models.Interaction, interaction_id)
    if interaction is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Interaction not found")
    return interaction


@router.delete("/{interaction_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_interaction(interaction_id: int, db: Session = Depends(get_db)) -> None:
    """Delete an interaction."""

    interaction = db.get(models.Interaction, interaction_id)
    if interaction is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Interaction not found")
    db.delete(interaction)
    db.commit()
