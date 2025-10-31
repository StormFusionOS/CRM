"""Routes for media management."""
from __future__ import annotations

from pathlib import Path
from typing import List

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.core.security import RoleEnum
from app.dependencies import get_current_user, get_db
from app.utils.files import detect_mime_type, save_upload_file
from app import models
from app.schemas import media as media_schemas


router = APIRouter(prefix="/api/media", tags=["media"], dependencies=[Depends(get_current_user)])


@router.post("", response_model=media_schemas.MediaFileRead)
async def upload_media(
    file: UploadFile = File(...),
    related_model: str | None = None,
    related_id: int | None = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
) -> models.MediaFile:
    """Upload a media file and store metadata."""

    contents = await file.read()
    stored_path = save_upload_file(file, data=contents)
    media_record = models.MediaFile(
        file_path=str(stored_path),
        original_filename=file.filename,
        owner_id=current_user.id,
        related_model=related_model,
        related_id=related_id,
        content_type=file.content_type,
    )
    db.add(media_record)
    db.commit()
    db.refresh(media_record)
    return media_record


@router.get("", response_model=List[media_schemas.MediaFileRead])
def list_media(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)) -> List[models.MediaFile]:
    """List media files owned by the current user or accessible to admins."""

    query = db.query(models.MediaFile)
    if current_user.role != RoleEnum.admin:
        query = query.filter(models.MediaFile.owner_id == current_user.id)
    return query.order_by(models.MediaFile.created_at.desc()).all()


@router.get("/{media_id}")
def download_media(media_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)) -> FileResponse:
    """Serve a media file from disk with access control."""

    media_record = db.get(models.MediaFile, media_id)
    if media_record is None:
        raise HTTPException(status_code=404, detail="Media not found")
    if current_user.role != RoleEnum.admin and media_record.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Access denied")
    path = Path(media_record.file_path)
    if not path.exists():
        raise HTTPException(status_code=404, detail="File missing")
    return FileResponse(path, media_type=media_record.content_type or detect_mime_type(path), filename=media_record.original_filename)
