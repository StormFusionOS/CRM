"""Pydantic schemas for API requests/responses."""
from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    sub: str


class LoginRequest(BaseModel):
    username: EmailStr
    password: str


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None


class ContactBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: Optional[str] = None


class ContactCreate(ContactBase):
    pass


class ContactUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None


class Contact(ContactBase):
    id: int
    owner_id: int

    class Config:
        orm_mode = True


class Interaction(BaseModel):
    id: int
    contact_id: int
    source: str
    payload: str
    created_at: datetime

    class Config:
        orm_mode = True
