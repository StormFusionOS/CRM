"""Security utilities including password hashing and JWT token helpers."""
from __future__ import annotations

from datetime import datetime, timedelta
from enum import Enum
from typing import Any, Dict

from fastapi import HTTPException, status
from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class RoleEnum(str, Enum):
    """Enumeration of supported user roles."""

    admin = "admin"
    sales = "sales"
    tech = "tech"
    client = "client"


class TokenError(HTTPException):
    """Custom exception raised for token validation issues."""

    def __init__(self, detail: str = "Could not validate credentials") -> None:
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            headers={"WWW-Authenticate": "Bearer"},
        )


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain text password against a hashed password."""

    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash a password using a secure hashing algorithm."""

    return pwd_context.hash(password)


def create_access_token(subject: str, expires_delta: timedelta | None = None, extra_claims: Dict[str, Any] | None = None) -> str:
    """Create a JWT access token for the given subject."""

    if expires_delta is None:
        expires_delta = timedelta(minutes=settings.access_token_expire_minutes)
    expire = datetime.utcnow() + expires_delta
    to_encode: Dict[str, Any] = {"sub": subject, "exp": expire}
    if extra_claims:
        to_encode.update(extra_claims)
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)
    return encoded_jwt


def decode_access_token(token: str) -> Dict[str, Any]:
    """Decode and validate a JWT access token."""

    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
    except JWTError as exc:  # pragma: no cover - critical security path
        raise TokenError() from exc
    return payload
