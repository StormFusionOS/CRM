"""Utility helpers for password hashing and token management."""
from __future__ import annotations

import hashlib
import secrets
from typing import Dict

TOKEN_STORE: Dict[str, str] = {}


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def verify_password(password: str, hashed_password: str) -> bool:
    return hash_password(password) == hashed_password


def generate_token(user_email: str) -> str:
    token = secrets.token_hex(16)
    TOKEN_STORE[token] = user_email
    return token


def revoke_token(token: str) -> None:
    TOKEN_STORE.pop(token, None)
