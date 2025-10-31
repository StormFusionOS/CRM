"""Pytest configuration and fixtures for backend tests."""
from __future__ import annotations

from typing import Dict, Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from app import models
from app.dependencies import get_db
from app.main import app
from app.security import TOKEN_STORE, hash_password

SQLALCHEMY_DATABASE_URL = "sqlite+pysqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="session", autouse=True)
def create_test_database() -> Generator[None, None, None]:
    """Create database schema for tests."""
    models.Base.metadata.create_all(bind=engine)
    yield
    models.Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def db_session() -> Generator[Session, None, None]:
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


@pytest.fixture()
def client(db_session: Session) -> Generator[TestClient, None, None]:
    """Provide a TestClient that uses the in-memory database."""

    def override_get_db() -> Generator[Session, None, None]:
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
    TOKEN_STORE.clear()


@pytest.fixture()
def test_user(db_session: Session) -> models.User:
    user = models.User(
        email="qa@example.com",
        hashed_password=hash_password("s3cret"),
        full_name="QA Engineer",
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture()
def auth_headers(client: TestClient, test_user: models.User) -> Dict[str, str]:
    response = client.post(
        "/auth/login",
        data={"username": test_user.email, "password": "s3cret"},
        headers={"content-type": "application/x-www-form-urlencoded"},
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
