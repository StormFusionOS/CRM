"""Schemas for pipeline stage management."""
from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class PipelineStageBase(BaseModel):
    """Base schema for pipeline stages."""

    name: str = Field(..., max_length=255)
    description: Optional[str] = None
    order: int = Field(..., ge=0)


class PipelineStageCreate(PipelineStageBase):
    """Schema for creating pipeline stages."""

    pass


class PipelineStageUpdate(BaseModel):
    """Schema for updating pipeline stages."""

    name: Optional[str] = Field(default=None, max_length=255)
    description: Optional[str] = None
    order: Optional[int] = Field(default=None, ge=0)


class PipelineStageRead(PipelineStageBase):
    """Schema for reading pipeline stages."""

    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class LeadPipelineMove(BaseModel):
    """Payload for moving a lead between pipeline stages."""

    lead_id: int
    stage_id: int
