"""FastAPI dependencies for database sessions and authentication."""
from __future__ import annotations

from typing import Callable, Generator

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.security import RoleEnum, TokenError, decode_access_token
from app.db.session import SessionLocal
from app import models


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def get_db() -> Generator[Session, None, None]:
    """Yield a database session for request scope."""

    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)) -> models.User:
    """Retrieve the current user based on the JWT token."""

    payload = decode_access_token(token)
    user_id = payload.get("sub")
    if user_id is None:
        raise TokenError()
    user = db.get(models.User, int(user_id))
    if user is None:
        raise TokenError()
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Inactive user")
    return user


def require_roles(*roles: RoleEnum | str) -> Callable[[models.User], models.User]:
    """Dependency to ensure the current user has one of the allowed roles."""

    allowed_roles = {role.value if isinstance(role, RoleEnum) else role for role in roles}

    def dependency(current_user: models.User = Depends(get_current_user)) -> models.User:
        if allowed_roles and current_user.role.value not in allowed_roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
        return current_user

    return dependency
