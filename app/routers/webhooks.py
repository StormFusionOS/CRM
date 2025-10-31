"""Webhook endpoints for external integrations."""
from __future__ import annotations

import json
from datetime import datetime
from typing import Any, Dict

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from twilio.request_validator import RequestValidator

from app.core.config import settings
from app import models
from app.dependencies import get_db


router = APIRouter(prefix="/webhook", tags=["webhooks"])


def _log_webhook(db: Session, source: str, headers: Dict[str, Any], payload: Dict[str, Any], status_text: str, details: str | None = None) -> None:
    """Persist webhook logs for auditing."""

    log_entry = models.WebhookLog(source=source, headers=headers, payload=payload, status=status_text, details=details)
    db.add(log_entry)
    db.commit()


def _deduplicate_contact(db: Session, *, email: str | None, phone: str | None, name: str | None = None) -> models.Contact:
    """Find or create a contact based on email or phone."""

    contact_query = db.query(models.Contact)
    contact = None
    if email:
        contact = contact_query.filter(models.Contact.email == email).first()
    if contact is None and phone:
        contact = contact_query.filter(models.Contact.phone == phone).first()
    if contact is None:
        contact = models.Contact(name=name or email or phone or "Unknown", email=email, phone=phone)
        db.add(contact)
        db.commit()
        db.refresh(contact)
    return contact


def _record_interaction(
    db: Session,
    *,
    contact: models.Contact,
    lead: models.Lead | None,
    interaction_type: models.InteractionTypeEnum,
    content: str,
    metadata: Dict[str, Any],
) -> models.Interaction:
    """Create an interaction record for webhook events."""

    interaction = models.Interaction(
        contact_id=contact.id,
        lead_id=lead.id if lead else None,
        type=interaction_type,
        channel=metadata.get("channel"),
        timestamp=datetime.utcnow(),
        content=content,
        metadata=metadata,
    )
    db.add(interaction)
    db.commit()
    db.refresh(interaction)
    return interaction


def _ensure_lead(db: Session, contact: models.Contact, source: str, notes: str | None = None) -> models.Lead:
    """Ensure a lead exists for the contact sourced from the webhook."""

    lead = db.query(models.Lead).filter(models.Lead.contact_id == contact.id).order_by(models.Lead.created_at.desc()).first()
    if lead is None:
        lead = models.Lead(contact=contact, source=source, notes=notes)
        db.add(lead)
        db.commit()
        db.refresh(lead)
    return lead


@router.post("/twilio")
async def twilio_webhook(request: Request, db: Session = Depends(get_db)) -> Dict[str, str]:
    """Handle Twilio SMS and voice webhooks with signature validation."""

    form = await request.form()
    form_dict = dict(form)
    signature = request.headers.get("X-Twilio-Signature", "")
    validator = RequestValidator(settings.twilio_auth_token or "")
    if not settings.twilio_auth_token or not validator.validate(str(request.url), form_dict, signature):
        _log_webhook(db, "twilio", dict(request.headers), form_dict, "rejected", "Signature validation failed")
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid signature")

    from_number = form_dict.get("From") or form_dict.get("Caller")
    body = form_dict.get("Body", "")
    contact = _deduplicate_contact(db, email=None, phone=from_number, name=form_dict.get("FromCity"))
    lead = _ensure_lead(db, contact, source="twilio", notes=body)
    interaction_type = models.InteractionTypeEnum.sms if "Body" in form_dict else models.InteractionTypeEnum.call
    _record_interaction(
        db,
        contact=contact,
        lead=lead,
        interaction_type=interaction_type,
        content=body or form_dict.get("CallStatus", ""),
        metadata={"channel": "twilio", "raw": form_dict},
    )
    _log_webhook(db, "twilio", dict(request.headers), form_dict, "processed")
    return {"status": "received"}


def _validate_source_token(request: Request, token_header: str, expected_value: str | None) -> None:
    """Common validation for webhook authenticity using shared tokens."""

    provided = request.headers.get(token_header)
    if expected_value and provided != expected_value:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Unauthorized webhook source")


async def _handle_generic_webhook(
    request: Request,
    db: Session,
    source: str,
    token_header: str,
    expected_token: str | None,
) -> Dict[str, str]:
    """Process generic webhook payload and create or update leads."""

    _validate_source_token(request, token_header, expected_token)
    payload = await request.json()
    email = payload.get("email")
    phone = payload.get("phone")
    name = payload.get("name")
    contact = _deduplicate_contact(db, email=email, phone=phone, name=name)
    lead = _ensure_lead(db, contact, source=source, notes=json.dumps(payload))
    _record_interaction(
        db,
        contact=contact,
        lead=lead,
        interaction_type=models.InteractionTypeEnum.social,
        content=f"Lead captured from {source}",
        metadata={"channel": source, "raw": payload},
    )
    _log_webhook(db, source, dict(request.headers), payload, "processed")
    return {"status": "received"}


@router.post("/facebook")
async def facebook_webhook(request: Request, db: Session = Depends(get_db)) -> Dict[str, str]:
    """Receive Facebook lead ads webhook events."""

    expected = settings.secret_key  # reuse secret for simplicity; production should use dedicated secret
    return await _handle_generic_webhook(request, db, "facebook", "X-Hub-Signature", expected)


@router.post("/yelp")
async def yelp_webhook(request: Request, db: Session = Depends(get_db)) -> Dict[str, str]:
    """Receive Yelp review webhook events."""

    expected = settings.secret_key
    return await _handle_generic_webhook(request, db, "yelp", "X-Yelp-Signature", expected)


@router.post("/google")
async def google_webhook(request: Request, db: Session = Depends(get_db)) -> Dict[str, str]:
    """Receive Google Ads lead webhook events."""

    expected = settings.secret_key
    return await _handle_generic_webhook(request, db, "google", "X-Goog-Signature", expected)
