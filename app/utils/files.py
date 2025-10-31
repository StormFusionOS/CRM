"""Utility helpers for media file handling."""
from __future__ import annotations

import mimetypes
import os
import uuid
from pathlib import Path

from fastapi import UploadFile

from app.core.config import settings


def save_upload_file(upload_file: UploadFile, subdirectory: str = "", data: bytes | None = None) -> Path:
    """Persist an uploaded file to the media directory and return its path."""

    target_dir = settings.media_root / subdirectory
    target_dir.mkdir(parents=True, exist_ok=True)
    file_extension = Path(upload_file.filename or "").suffix
    safe_name = f"{uuid.uuid4().hex}{file_extension}"
    destination = target_dir / safe_name

    with destination.open("wb") as buffer:
        contents = data if data is not None else upload_file.file.read()
        buffer.write(contents)

    upload_file.file.close()
    return destination


def detect_mime_type(path: Path) -> str:
    """Attempt to detect the MIME type for a given file path."""

    mime_type, _ = mimetypes.guess_type(path)
    return mime_type or "application/octet-stream"


def remove_file(path: Path) -> None:
    """Remove a file if it exists."""

    try:
        path.unlink(missing_ok=True)  # type: ignore[arg-type]
    except TypeError:
        if path.exists():
            path.unlink()
