"""Routes for user administration."""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import get_password_hash, RoleEnum
from app.dependencies import get_db, require_roles
from app import models
from app.schemas import users as user_schemas


router = APIRouter(prefix="/api/users", tags=["users"], dependencies=[Depends(require_roles(RoleEnum.admin))])


@router.get("", response_model=list[user_schemas.UserRead])
def list_users(db: Session = Depends(get_db)) -> list[models.User]:
    """List all users (admin only)."""

    return db.query(models.User).all()


@router.get("/{user_id}", response_model=user_schemas.UserRead)
def get_user(user_id: int, db: Session = Depends(get_db)) -> models.User:
    """Retrieve a single user by ID."""

    user = db.get(models.User, user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


@router.post("", response_model=user_schemas.UserRead, status_code=status.HTTP_201_CREATED)
def create_user(payload: user_schemas.UserCreate, db: Session = Depends(get_db)) -> models.User:
    """Create a new user (admin only)."""

    if db.query(models.User).filter(models.User.email == payload.email).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already exists")
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


@router.put("/{user_id}", response_model=user_schemas.UserRead)
def update_user(user_id: int, payload: user_schemas.UserUpdate, db: Session = Depends(get_db)) -> models.User:
    """Update user details."""

    user = db.get(models.User, user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    for field, value in payload.model_dump(exclude_unset=True).items():
        if field == "password" and value:
            user.hashed_password = get_password_hash(value)
        elif hasattr(user, field):
            setattr(user, field, value)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, db: Session = Depends(get_db)) -> None:
    """Delete a user by ID."""

    user = db.get(models.User, user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    db.delete(user)
    db.commit()
