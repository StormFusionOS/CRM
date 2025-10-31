"""In-memory data store for the CRM admin tooling demo."""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Dict, List, Optional


@dataclass
class ContentVersion:
    """Represents a versioned snapshot of a piece of content."""

    content_id: str
    version: int
    body: str
    created_at: datetime


@dataclass
class ChangeLogEntry:
    """Represents a proposed AI-generated change awaiting review."""

    id: int
    content_id: str
    proposed_version: int
    proposed_content: str
    current_version: int
    current_content: str
    status: str = "pending"
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    processed_at: Optional[datetime] = None
    processed_by: Optional[str] = None
    notes: Optional[str] = None


@dataclass
class PageAudit:
    """High level SEO audit summary for a single page."""

    id: int
    url: str
    audited_at: datetime
    score: int
    status: str


@dataclass
class AuditIssue:
    """Detailed audit issue for a page."""

    id: int
    audit_id: int
    severity: str
    description: str
    action_url: Optional[str] = None


# Seed data ---------------------------------------------------------------

content_versions: Dict[str, List[ContentVersion]] = {
    "home": [
        ContentVersion(
            content_id="home",
            version=1,
            body="Welcome to our CRM platform. Optimize your workflow today!",
            created_at=datetime(2023, 12, 1, tzinfo=timezone.utc),
        ),
        ContentVersion(
            content_id="home",
            version=2,
            body="Welcome to the CRM dashboard. Automate workflows and boost collaboration.",
            created_at=datetime(2024, 1, 10, tzinfo=timezone.utc),
        ),
    ],
    "about": [
        ContentVersion(
            content_id="about",
            version=1,
            body="We help marketing teams stay aligned and efficient.",
            created_at=datetime(2023, 9, 15, tzinfo=timezone.utc),
        )
    ],
}

change_log: Dict[int, ChangeLogEntry] = {
    1: ChangeLogEntry(
        id=1,
        content_id="home",
        current_version=2,
        current_content=content_versions["home"][1].body,
        proposed_version=3,
        proposed_content="Welcome to the CRM hub. Automate, collaborate, and convert leads faster.",
    ),
    2: ChangeLogEntry(
        id=2,
        content_id="about",
        current_version=1,
        current_content=content_versions["about"][0].body,
        proposed_version=2,
        proposed_content="We empower marketing and sales teams with shared data and AI-driven insights.",
    ),
}

page_audits: Dict[int, PageAudit] = {
    10: PageAudit(
        id=10,
        url="/pricing",
        audited_at=datetime(2024, 1, 20, 14, 30, tzinfo=timezone.utc),
        score=78,
        status="fail",
    ),
    11: PageAudit(
        id=11,
        url="/features",
        audited_at=datetime(2024, 1, 21, 9, 10, tzinfo=timezone.utc),
        score=92,
        status="pass",
    ),
}

audit_issues: List[AuditIssue] = [
    AuditIssue(
        id=100,
        audit_id=10,
        severity="critical",
        description="Missing meta description tag.",
        action_url="https://cms.local/pricing",
    ),
    AuditIssue(
        id=101,
        audit_id=10,
        severity="warning",
        description="Header hierarchy skips from H1 to H3.",
    ),
    AuditIssue(
        id=102,
        audit_id=11,
        severity="info",
        description="Consider shortening page title to under 60 characters.",
    ),
]


# Helper utilities -------------------------------------------------------

def get_content_version(content_id: str, version: int) -> Optional[ContentVersion]:
    """Return a content version by ID and version number."""

    versions = content_versions.get(content_id, [])
    for snapshot in versions:
        if snapshot.version == version:
            return snapshot
    return None


def add_content_version(snapshot: ContentVersion) -> None:
    """Add a new content version to the in-memory store."""

    versions = content_versions.setdefault(snapshot.content_id, [])
    versions.append(snapshot)
    versions.sort(key=lambda item: item.version)


def update_change_log(entry: ChangeLogEntry) -> None:
    """Persist an updated change log entry to the store."""

    change_log[entry.id] = entry
