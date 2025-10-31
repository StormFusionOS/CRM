"""Schemas for campaign resources."""
from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class CampaignBase(BaseModel):
    """Base schema for campaigns."""

    name: str = Field(..., max_length=255)
    description: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    budget: Optional[float] = Field(default=None)


class CampaignCreate(CampaignBase):
    """Schema for creating campaigns."""

    pass


class CampaignUpdate(BaseModel):
    """Schema for updating campaigns."""

    name: Optional[str] = Field(default=None, max_length=255)
    description: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    budget: Optional[float] = Field(default=None)


class CampaignRead(CampaignBase):
    """Schema for reading campaigns."""

    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class LeadCampaignBase(BaseModel):
    """Base schema for lead-campaign relationships."""

    lead_id: int
    campaign_id: int
    status: Optional[str] = None


class LeadCampaignCreate(LeadCampaignBase):
    """Schema for creating lead campaign links."""

    pass


class LeadCampaignRead(LeadCampaignBase):
    """Schema for reading lead campaign links."""

    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
