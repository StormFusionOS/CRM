"""Endpoints that expose SEO audit information for admin tooling."""
from __future__ import annotations

from collections import defaultdict
from typing import Iterable, List

from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel

from ..data import AuditIssue, PageAudit, audit_issues, page_audits

router = APIRouter(prefix="/api/seo", tags=["seo"])


class AuditIssueResponse(BaseModel):
    """Serialized representation of an audit issue."""

    id: int
    severity: str
    description: str
    action_url: str | None


class PageAuditResponse(BaseModel):
    """High level audit summary with issue counts."""

    id: int
    url: str
    audited_at: str
    score: int
    status: str
    issue_counts: dict[str, int]


class PageAuditDetailResponse(PageAuditResponse):
    """Detailed audit representation including issues."""

    issues: List[AuditIssueResponse]


@router.get("/audits", response_model=List[PageAuditResponse])
def list_audits(
    severity: str | None = Query(None, description="Filter audits that contain issues of this severity."),
    status_filter: str | None = Query(None, alias="status", description="Filter by audit status."),
) -> List[PageAuditResponse]:
    """Return all page audits with optional filtering."""

    filtered = (
        audit
        for audit in page_audits.values()
        if status_filter in (None, audit.status)
    )

    results: List[PageAuditResponse] = []
    for audit in sorted(filtered, key=lambda item: item.audited_at, reverse=True):
        issues_for_audit = [issue for issue in audit_issues if issue.audit_id == audit.id]
        if severity and not any(issue.severity == severity for issue in issues_for_audit):
            continue
        counts = _count_issues_by_severity(issues_for_audit)
        results.append(
            PageAuditResponse(
                id=audit.id,
                url=audit.url,
                audited_at=audit.audited_at.isoformat(),
                score=audit.score,
                status=audit.status,
                issue_counts=counts,
            )
        )
    return results


@router.get("/audits/{audit_id}", response_model=PageAuditDetailResponse)
def get_audit(audit_id: int) -> PageAuditDetailResponse:
    """Return a single audit including all associated issues."""

    audit = page_audits.get(audit_id)
    if audit is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Audit not found")

    issues_for_audit = [issue for issue in audit_issues if issue.audit_id == audit.id]
    return PageAuditDetailResponse(
        id=audit.id,
        url=audit.url,
        audited_at=audit.audited_at.isoformat(),
        score=audit.score,
        status=audit.status,
        issue_counts=_count_issues_by_severity(issues_for_audit),
        issues=[AuditIssueResponse(**issue.__dict__) for issue in issues_for_audit],
    )


def _count_issues_by_severity(issues: Iterable[AuditIssue]) -> dict[str, int]:
    """Return counts of issues grouped by severity."""

    counts: dict[str, int] = defaultdict(int)
    for issue in issues:
        counts[issue.severity] += 1
    return dict(counts)
