"""Routes for pipeline stage management and lead movement."""
from __future__ import annotations

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import RoleEnum
from app.dependencies import get_db, require_roles
from app import models
from app.schemas import pipeline as pipeline_schemas
from app.schemas import leads as lead_schemas


router = APIRouter(prefix="/api/pipeline", tags=["pipeline"], dependencies=[Depends(require_roles(RoleEnum.admin, RoleEnum.sales))])


@router.get("/stages", response_model=List[pipeline_schemas.PipelineStageRead])
def list_stages(db: Session = Depends(get_db)) -> List[models.PipelineStage]:
    """List sales pipeline stages."""

    return db.query(models.PipelineStage).order_by(models.PipelineStage.order.asc()).all()


@router.post("/stages", response_model=pipeline_schemas.PipelineStageRead, status_code=status.HTTP_201_CREATED)
def create_stage(payload: pipeline_schemas.PipelineStageCreate, db: Session = Depends(get_db)) -> models.PipelineStage:
    """Create a new pipeline stage."""

    if db.query(models.PipelineStage).filter(models.PipelineStage.name == payload.name).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Stage name already exists")
    stage = models.PipelineStage(**payload.model_dump())
    db.add(stage)
    db.commit()
    db.refresh(stage)
    return stage


@router.put("/stages/{stage_id}", response_model=pipeline_schemas.PipelineStageRead)
def update_stage(stage_id: int, payload: pipeline_schemas.PipelineStageUpdate, db: Session = Depends(get_db)) -> models.PipelineStage:
    """Update an existing pipeline stage."""

    stage = db.get(models.PipelineStage, stage_id)
    if stage is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Stage not found")
    data = payload.model_dump(exclude_unset=True)
    if "name" in data and data["name"] != stage.name:
        if db.query(models.PipelineStage).filter(models.PipelineStage.name == data["name"], models.PipelineStage.id != stage_id).first():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Stage name already exists")
    for field, value in data.items():
        setattr(stage, field, value)
    db.add(stage)
    db.commit()
    db.refresh(stage)
    return stage


@router.delete("/stages/{stage_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_stage(stage_id: int, db: Session = Depends(get_db)) -> None:
    """Delete a pipeline stage."""

    stage = db.get(models.PipelineStage, stage_id)
    if stage is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Stage not found")
    db.delete(stage)
    db.commit()


@router.post("/move", status_code=status.HTTP_200_OK)
def move_lead(payload: pipeline_schemas.LeadPipelineMove, db: Session = Depends(get_db)) -> dict:
    """Move a lead to a different pipeline stage."""

    lead = db.get(models.Lead, payload.lead_id)
    if lead is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lead not found")
    stage = db.get(models.PipelineStage, payload.stage_id)
    if stage is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Stage not found")
    if lead.pipeline_entry is None:
        entry = models.LeadPipeline(lead=lead, stage=stage)
        db.add(entry)
    else:
        lead.pipeline_entry.stage = stage
    lead.stage = stage.name
    db.add(lead)
    db.commit()
    return {"detail": "Lead moved"}


@router.get("/stages/{stage_id}/leads", response_model=List[lead_schemas.LeadRead])
def list_leads_by_stage(stage_id: int, db: Session = Depends(get_db)) -> List[models.Lead]:
    """List leads belonging to a specific stage."""

    stage = db.get(models.PipelineStage, stage_id)
    if stage is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Stage not found")
    return [entry.lead for entry in stage.leads if entry.lead]
