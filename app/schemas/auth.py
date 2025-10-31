"""Pydantic schemas for authentication workflows."""
from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field

from app.core.security import RoleEnum


class Token(BaseModel):
    """Represents an access token response."""

    access_token: str = Field(..., description="JWT access token")
    token_type: str = Field(default="bearer", description="Token type, always 'bearer'")
    expires_in: int = Field(..., description="Token expiry time in seconds")


class TokenPayload(BaseModel):
    """Payload extracted from JWT token."""

    sub: Optional[str] = None
    exp: Optional[int] = None
    role: Optional[RoleEnum] = None


class UserLogin(BaseModel):
    """User login request payload."""

    username: EmailStr
    password: str


class UserRegistration(BaseModel):
    """User registration request payload."""

    email: EmailStr
    password: str
    full_name: Optional[str] = None
    role: RoleEnum = RoleEnum.client


class UserResponse(BaseModel):
    """User response payload."""

    id: int
    email: EmailStr
    full_name: Optional[str]
    role: RoleEnum
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
