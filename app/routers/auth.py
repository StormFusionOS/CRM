"""Authentication and authorization routes."""
from __future__ import annotations

from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import create_access_token, get_password_hash, verify_password
from app.dependencies import get_current_user, get_db
from app import models
from app.schemas import auth as auth_schemas


router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=auth_schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def register_user(payload: auth_schemas.UserRegistration, db: Session = Depends(get_db)) -> models.User:
    """Register a new user with hashed password."""

    existing_user = db.query(models.User).filter(models.User.email == payload.email).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    user = models.User(
        email=payload.email,
        full_name=payload.full_name,
        role=payload.role,
        hashed_password=get_password_hash(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/login", response_model=auth_schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)) -> auth_schemas.Token:
    """Authenticate a user and return an access token."""

    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if user is None or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Incorrect email or password")
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User is inactive")

    expires_delta = timedelta(minutes=settings.access_token_expire_minutes)
    token = create_access_token(
        subject=str(user.id),
        expires_delta=expires_delta,
        extra_claims={"role": user.role},
    )
    return auth_schemas.Token(access_token=token, token_type="bearer", expires_in=int(expires_delta.total_seconds()))


@router.get("/me", response_model=auth_schemas.UserResponse)
def get_me(current_user: models.User = Depends(get_current_user)) -> models.User:
    """Return the authenticated user profile."""

    return current_user
