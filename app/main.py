"""FastAPI application exposing CRM endpoints."""
from __future__ import annotations

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from . import models, schemas
from .database import engine
from .dependencies import get_current_user, get_db
from .security import generate_token, hash_password, verify_password

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="CRM Platform")


@app.post("/auth/login", response_model=schemas.Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid login")
    token = generate_token(user.email)
    return schemas.Token(access_token=token)


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/contacts", response_model=schemas.Contact)
def create_contact(
    contact_in: schemas.ContactCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    contact = models.Contact(owner_id=current_user.id, **contact_in.dict())
    db.add(contact)
    db.commit()
    db.refresh(contact)
    return contact


@app.get("/contacts/{contact_id}", response_model=schemas.Contact)
def get_contact(
    contact_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    contact = (
        db.query(models.Contact)
        .filter(
            models.Contact.id == contact_id, models.Contact.owner_id == current_user.id
        )
        .first()
    )
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    return contact


@app.put("/contacts/{contact_id}", response_model=schemas.Contact)
def update_contact(
    contact_id: int,
    contact_in: schemas.ContactUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    contact = (
        db.query(models.Contact)
        .filter(
            models.Contact.id == contact_id, models.Contact.owner_id == current_user.id
        )
        .first()
    )
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    for field, value in contact_in.dict(exclude_unset=True).items():
        setattr(contact, field, value)
    db.add(contact)
    db.commit()
    db.refresh(contact)
    return contact


@app.delete("/contacts/{contact_id}")
def delete_contact(
    contact_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    contact = (
        db.query(models.Contact)
        .filter(
            models.Contact.id == contact_id, models.Contact.owner_id == current_user.id
        )
        .first()
    )
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")
    db.delete(contact)
    db.commit()
    return {"status": "deleted"}


@app.post("/webhooks/twilio")
def receive_twilio_webhook(
    payload: dict,
    db: Session = Depends(get_db),
):
    contact_id = payload.get("contact_id")
    message = payload.get("message", "")
    if not contact_id:
        raise HTTPException(status_code=400, detail="Missing contact_id")
    interaction = models.Interaction(
        contact_id=contact_id, source="twilio", payload=message
    )
    db.add(interaction)
    db.commit()
    return {"status": "received"}
