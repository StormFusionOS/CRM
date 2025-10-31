"""Routes for campaign management."""
from __future__ import annotations

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import RoleEnum
from app.dependencies import get_db, require_roles
from app import models
from app.schemas import campaigns as campaign_schemas


router = APIRouter(prefix="/api/campaigns", tags=["campaigns"], dependencies=[Depends(require_roles(RoleEnum.admin, RoleEnum.sales))])


@router.get("", response_model=List[campaign_schemas.CampaignRead])
def list_campaigns(db: Session = Depends(get_db)) -> List[models.Campaign]:
    """List all marketing campaigns."""

    return db.query(models.Campaign).all()


@router.post("", response_model=campaign_schemas.CampaignRead, status_code=status.HTTP_201_CREATED)
def create_campaign(payload: campaign_schemas.CampaignCreate, db: Session = Depends(get_db)) -> models.Campaign:
    """Create a new campaign."""

    if db.query(models.Campaign).filter(models.Campaign.name == payload.name).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Campaign name must be unique")
    campaign = models.Campaign(**payload.model_dump())
    db.add(campaign)
    db.commit()
    db.refresh(campaign)
    return campaign


@router.put("/{campaign_id}", response_model=campaign_schemas.CampaignRead)
def update_campaign(campaign_id: int, payload: campaign_schemas.CampaignUpdate, db: Session = Depends(get_db)) -> models.Campaign:
    """Update campaign details."""

    campaign = db.get(models.Campaign, campaign_id)
    if campaign is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campaign not found")
    data = payload.model_dump(exclude_unset=True)
    if "name" in data and data["name"] != campaign.name:
        if db.query(models.Campaign).filter(models.Campaign.name == data["name"], models.Campaign.id != campaign_id).first():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Campaign name already exists")
    for field, value in data.items():
        setattr(campaign, field, value)
    db.add(campaign)
    db.commit()
    db.refresh(campaign)
    return campaign


@router.delete("/{campaign_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_campaign(campaign_id: int, db: Session = Depends(get_db)) -> None:
    """Delete a campaign."""

    campaign = db.get(models.Campaign, campaign_id)
    if campaign is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campaign not found")
    db.delete(campaign)
    db.commit()


@router.post("/{campaign_id}/leads", response_model=campaign_schemas.LeadCampaignRead, status_code=status.HTTP_201_CREATED)
def add_lead_to_campaign(campaign_id: int, payload: campaign_schemas.LeadCampaignCreate, db: Session = Depends(get_db)) -> models.LeadCampaign:
    """Associate a lead with a campaign."""

    campaign = db.get(models.Campaign, campaign_id)
    if campaign is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Campaign not found")
    lead = db.get(models.Lead, payload.lead_id)
    if lead is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lead not found")
    association = models.LeadCampaign(lead=lead, campaign=campaign, status=payload.status)
    db.add(association)
    db.commit()
    db.refresh(association)
    return association
