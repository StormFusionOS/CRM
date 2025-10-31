"""Webhook integration tests."""
from __future__ import annotations

from fastapi.testclient import TestClient

from app import models


def test_twilio_webhook_creates_interaction(
    client: TestClient, db_session, test_user, auth_headers
) -> None:
    """Simulate a Twilio webhook and ensure an interaction record is created."""
    contact = models.Contact(
        owner_id=test_user.id,
        first_name="Webhook",
        last_name="Contact",
        email="webhook@example.com",
    )
    db_session.add(contact)
    db_session.commit()
    db_session.refresh(contact)

    payload = {"contact_id": contact.id, "message": "Hello from Twilio"}
    response = client.post("/webhooks/twilio", json=payload, headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["status"] == "received"

    interactions = (
        db_session.query(models.Interaction)
        .filter(models.Interaction.contact_id == contact.id)
        .all()
    )
    assert len(interactions) == 1
    assert interactions[0].payload == "Hello from Twilio"
