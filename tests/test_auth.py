"""Authentication API tests."""
from __future__ import annotations

from fastapi.testclient import TestClient


def test_login_returns_token(client: TestClient, test_user) -> None:
    """Ensure the login endpoint returns a bearer token for valid credentials."""
    response = client.post(
        "/auth/login",
        data={"username": test_user.email, "password": "s3cret"},
        headers={"content-type": "application/x-www-form-urlencoded"},
    )
    assert response.status_code == 200
    body = response.json()
    assert "access_token" in body
    assert body["token_type"] == "bearer"


def test_protected_route_requires_token(client: TestClient) -> None:
    """Verify protected endpoints reject unauthenticated access."""
    response = client.post(
        "/contacts",
        json={
            "first_name": "No",
            "last_name": "Token",
            "email": "invalid@example.com",
        },
    )
    assert response.status_code == 401
