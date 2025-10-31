"""API endpoints for managing the change log review queue."""
from __future__ import annotations

from datetime import datetime, timezone
from typing import List

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel

from ..data import (
    ChangeLogEntry,
    add_content_version,
    change_log,
    content_versions,
    get_content_version,
    update_change_log,
)

router = APIRouter(prefix="/api/change-log", tags=["change-log"])


class ChangeLogResponse(BaseModel):
    """Serialized representation of a change log entry."""

    id: int
    content_id: str
    status: str
    created_at: datetime
    current_version: int
    proposed_version: int
    processed_at: datetime | None
    processed_by: str | None
    notes: str | None


class ChangeLogDetailResponse(ChangeLogResponse):
    """Extended representation including content snapshots for diffing."""

    current_content: str
    proposed_content: str


class ChangeLogActionRequest(BaseModel):
    """Payload to approve or reject a change log entry."""

    actor: str
    notes: str | None = None


@router.get("/", response_model=List[ChangeLogResponse])
def list_change_log() -> List[ChangeLogResponse]:
    """Return all change log entries ordered by creation time."""

    entries = sorted(change_log.values(), key=lambda item: item.created_at)
    return [_serialize_entry(entry) for entry in entries]


@router.get("/{entry_id}", response_model=ChangeLogDetailResponse)
def get_change_log(entry_id: int) -> ChangeLogDetailResponse:
    """Return detailed information for a single entry, including content."""

    entry = _get_mutable_entry(entry_id)
    return _serialize_entry(entry, include_content=True)


@router.post("/{entry_id}/approve", response_model=ChangeLogDetailResponse)
def approve_change(entry_id: int, payload: ChangeLogActionRequest) -> ChangeLogDetailResponse:
    """Mark a change log entry as approved and persist a new content version."""

    entry = _get_mutable_entry(entry_id)
    if entry.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Change has already been processed.",
        )

    entry.status = "approved"
    entry.processed_at = datetime.now(timezone.utc)
    entry.processed_by = payload.actor
    entry.notes = payload.notes

    _persist_proposed_version(entry)
    update_change_log(entry)
    return _serialize_entry(entry, include_content=True)


@router.post("/{entry_id}/reject", response_model=ChangeLogDetailResponse)
def reject_change(entry_id: int, payload: ChangeLogActionRequest) -> ChangeLogDetailResponse:
    """Mark a change log entry as rejected and capture reviewer notes."""

    entry = _get_mutable_entry(entry_id)
    if entry.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Change has already been processed.",
        )

    entry.status = "rejected"
    entry.processed_at = datetime.now(timezone.utc)
    entry.processed_by = payload.actor
    entry.notes = payload.notes

    update_change_log(entry)
    return _serialize_entry(entry, include_content=True)


def _get_mutable_entry(entry_id: int) -> ChangeLogEntry:
    """Return a change log entry or raise a 404."""

    try:
        return change_log[entry_id]
    except KeyError as exc:  # pragma: no cover - FastAPI handles 404 serialization
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND) from exc


def _persist_proposed_version(entry: ChangeLogEntry) -> None:
    """Persist the proposed content as a new version when approved."""

    existing_versions = content_versions.get(entry.content_id, [])
    latest_version = max((snapshot.version for snapshot in existing_versions), default=0)
    new_version_number = max(latest_version + 1, entry.proposed_version)

    snapshot = get_content_version(entry.content_id, new_version_number)
    if snapshot is None:
        from ..data import ContentVersion

        snapshot = ContentVersion(
            content_id=entry.content_id,
            version=new_version_number,
            body=entry.proposed_content,
            created_at=datetime.now(timezone.utc),
        )
        add_content_version(snapshot)

    entry.current_version = snapshot.version
    entry.current_content = snapshot.body


def _serialize_entry(entry: ChangeLogEntry, *, include_content: bool = False):
    """Return a serialized representation of a change log entry."""

    base = ChangeLogResponse(
        id=entry.id,
        content_id=entry.content_id,
        status=entry.status,
        created_at=entry.created_at,
        current_version=entry.current_version,
        proposed_version=entry.proposed_version,
        processed_at=entry.processed_at,
        processed_by=entry.processed_by,
        notes=entry.notes,
    )
    if not include_content:
        return base
    return ChangeLogDetailResponse(
        **base.model_dump(),
        current_content=entry.current_content,
        proposed_content=entry.proposed_content,
    )
