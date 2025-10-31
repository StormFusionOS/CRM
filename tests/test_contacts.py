"""CRUD workflow tests for the Contacts API."""
from __future__ import annotations

from fastapi.testclient import TestClient


def test_contact_lifecycle(client: TestClient, auth_headers, test_user) -> None:
    """Create, read, update, and delete a contact via the API."""
    # Create contact
    create_response = client.post(
        "/contacts",
        json={
            "first_name": "Ada",
            "last_name": "Lovelace",
            "email": "ada@example.com",
            "phone": "1234567890",
        },
        headers=auth_headers,
    )
    assert create_response.status_code == 200
    created_contact = create_response.json()
    contact_id = created_contact["id"]
    assert created_contact["owner_id"] == test_user.id

    # Retrieve contact
    get_response = client.get(f"/contacts/{contact_id}", headers=auth_headers)
    assert get_response.status_code == 200
    assert get_response.json()["email"] == "ada@example.com"

    # Update contact
    update_response = client.put(
        f"/contacts/{contact_id}",
        json={"phone": "9876543210"},
        headers=auth_headers,
    )
    assert update_response.status_code == 200
    assert update_response.json()["phone"] == "9876543210"

    # Delete contact
    delete_response = client.delete(f"/contacts/{contact_id}", headers=auth_headers)
    assert delete_response.status_code == 200
    assert delete_response.json()["status"] == "deleted"

    # Ensure contact is gone
    missing_response = client.get(f"/contacts/{contact_id}", headers=auth_headers)
    assert missing_response.status_code == 404
