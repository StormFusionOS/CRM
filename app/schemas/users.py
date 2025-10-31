"""User related Pydantic schemas."""
from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr

from app.core.security import RoleEnum


class UserBase(BaseModel):
    """Base attributes shared across user schemas."""

    email: EmailStr
    full_name: Optional[str] = None
    role: RoleEnum = RoleEnum.client


class UserCreate(UserBase):
    """Schema used when creating a new user."""

    password: str


class UserUpdate(BaseModel):
    """Schema used when updating user details."""

    full_name: Optional[str] = None
    role: Optional[RoleEnum] = None
    is_active: Optional[bool] = None
    password: Optional[str] = None


class UserRead(UserBase):
    """Schema representing a user in responses."""

    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
