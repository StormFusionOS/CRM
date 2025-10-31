"""Diff endpoint used by the review queue to compare content revisions."""
from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query, status

from ..data import ChangeLogEntry, change_log, get_content_version

router = APIRouter(prefix="/api", tags=["diff"])


@router.get("/diff")
def get_diff(
    contentId: str = Query(..., description="Identifier of the content item."),
    version1: int = Query(..., description="First version number to compare."),
    version2: int = Query(..., description="Second version number to compare."),
) -> dict[str, str]:
    """Return the string bodies of two content versions for diffing on the client."""

    first = get_content_version(contentId, version1)
    second = get_content_version(contentId, version2)

    if first is None or second is None:
        # Allow fallback to a change log entry if one of the versions represents a proposal.
        if (entry := _find_change_log_entry(contentId, version1, version2)) is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Version not found")
        return {"base": entry.current_content, "target": entry.proposed_content}

    return {"base": first.body, "target": second.body}


def _find_change_log_entry(content_id: str, version1: int, version2: int) -> ChangeLogEntry | None:
    """Return a change log entry matching either of the provided version numbers."""

    for entry in change_log.values():
        if entry.content_id != content_id:
            continue
        if entry.current_version in (version1, version2) or entry.proposed_version in (version1, version2):
            return entry
    return None
