"""Background and synchronous task helpers."""
from __future__ import annotations

from textwrap import shorten


def generate_contact_summary(notes: str) -> str:
    """Generate a deterministic contact summary for testing purposes."""
    normalized = " ".join(notes.split())
    headline = shorten(normalized, width=60, placeholder="...")
    return f"Summary: {headline}" if headline else "Summary: No notes provided"
