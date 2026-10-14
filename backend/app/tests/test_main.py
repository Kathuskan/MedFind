import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_health_check(client: AsyncClient):
    response = await client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


@pytest.mark.asyncio
async def test_root_endpoint(client: AsyncClient):
    response = await client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "version" in data


@pytest.mark.asyncio
async def test_auth_registration_and_login(client: AsyncClient):
    # Register
    user_payload = {
        "email": "test@example.com",
        "password": "StrongPassword123!",
        "full_name": "Test User",
        "phone_number": "+1234567890",
        "role": "patient",
    }
    reg_response = await client.post("/api/auth/register", json=user_payload)
    assert reg_response.status_code == 201
    user_data = reg_response.json()
    assert user_data["email"] == "test@example.com"

    # Login
    login_payload = {
        "email": "test@example.com",
        "password": "StrongPassword123!",
    }
    login_response = await client.post("/api/auth/login", json=login_payload)
    assert login_response.status_code == 200
    token_data = login_response.json()
    assert "access_token" in token_data
    assert token_data["token_type"] == "bearer"
