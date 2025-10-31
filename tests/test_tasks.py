"""Unit tests for synchronous task helpers."""
from __future__ import annotations

from app.tasks import generate_contact_summary


def test_generate_contact_summary_formats_response() -> None:
    notes = """This is a long paragraph about the customer.\nThey are interested in upsell."""
    summary = generate_contact_summary(notes)
    assert summary.startswith("Summary: ")
    assert "customer" in summary


def test_generate_contact_summary_handles_empty_input() -> None:
    assert generate_contact_summary(" ") == "Summary: No notes provided"
