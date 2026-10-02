import os
from datetime import UTC, datetime, timedelta
from uuid import UUID

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from sqlalchemy.pool import StaticPool

from app.config import get_settings
from app.db.models import Pharmacy, Product, StockReport
from app.db.session import Base, get_db
from app.domain.availability import stock_state
from app.main import app

NOW = datetime(2026, 10, 2, 12, tzinfo=UTC)


@pytest.mark.parametrize(
    "age,disputed,expected",
    [
        (timedelta(hours=23, minutes=59), False, "IN_STOCK"),
        (timedelta(hours=24), False, "UNCONFIRMED"),
        (timedelta(hours=25), False, "UNCONFIRMED"),
        (timedelta(hours=-1), False, "UNCONFIRMED"),
        (timedelta(minutes=1), True, "UNCONFIRMED"),
    ],
)
def test_freshness_boundaries(age, disputed, expected):
    assert stock_state("IN_STOCK", NOW - age, disputed, NOW)[0] == expected


def test_missing_timestamp_is_unconfirmed():
    assert stock_state("LOW", None, False, NOW) == ("UNCONFIRMED", None)


@pytest.fixture
def client():
    url = os.environ.get("TEST_DATABASE_URL")
    # A dedicated throwaway database only. CI supplies PostgreSQL; local quick tests use SQLite.
    engine = (
        create_engine(url)
        if url
        else create_engine(
            "sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool
        )
    )
    Base.metadata.create_all(engine)
    with Session(engine) as db:
        db.add_all(
            [
                Product(id=UUID(int=1), name="Metformin", strength="500 mg", form="Tablet"),
                Product(id=UUID(int=2), name="Metformin", strength="850 mg", form="Tablet"),
                Pharmacy(
                    id=UUID(int=101), name="Demo One", town="Colombo", address="Demo", verified=True
                ),
                Pharmacy(
                    id=UUID(int=102), name="Hidden", town="Colombo", address="Demo", verified=False
                ),
                Pharmacy(
                    id=UUID(int=103),
                    name="Suspended",
                    town="Colombo",
                    address="Demo",
                    verified=True,
                    active=False,
                ),
            ]
        )
        db.flush()
        for pharmacy_id in [101, 102, 103]:
            db.add(
                StockReport(
                    pharmacy_id=UUID(int=pharmacy_id),
                    product_id=UUID(int=1),
                    status="IN_STOCK",
                    confirmed_at=datetime.now(UTC),
                )
            )
        db.commit()

    def override():
        with Session(engine) as db:
            yield db

    app.dependency_overrides[get_db] = override
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
    Base.metadata.drop_all(engine)
    engine.dispose()


def test_catalogue_preserves_exact_strengths(client):
    response = client.post("/api/v1/catalogue/search", json={"query": "  METFORMIN  "})
    assert response.status_code == 200
    assert {p["strength"] for p in response.json()} == {"500 mg", "850 mg"}
    assert response.headers["cache-control"] == "no-store"


def test_only_verified_active_pharmacies_are_public(client):
    response = client.post("/api/v1/availability/search", json={"product_id": str(UUID(int=1))})
    assert response.status_code == 200
    assert [x["pharmacy"]["name"] for x in response.json()["items"]] == ["Demo One"]
    assert client.get(f"/api/v1/pharmacies/{UUID(int=102)}").status_code == 404
    assert client.get(f"/api/v1/pharmacies/{UUID(int=103)}").status_code == 404


def test_exact_product_and_area_filter(client):
    response = client.post("/api/v1/availability/search", json={"product_id": str(UUID(int=2))})
    assert response.json()["items"] == []
    response = client.post(
        "/api/v1/availability/search", json={"product_id": str(UUID(int=1)), "town": "Jaffna"}
    )
    assert response.json()["items"] == []


def test_demo_entries_are_hidden_outside_demo_mode(client):
    settings = get_settings()
    original = settings.demo_mode
    settings.demo_mode = False
    try:
        assert client.get("/api/v1/towns").json() == []
        response = client.post("/api/v1/availability/search", json={"product_id": str(UUID(int=1))})
        assert response.json()["items"] == []
    finally:
        settings.demo_mode = original


def test_errors_do_not_echo_sensitive_input(client):
    response = client.post("/api/v1/availability/search", json={"product_id": "private-value"})
    assert response.status_code == 422
    assert "private-value" not in response.text
    assert response.json()["request_id"]
    assert client.post("/api/v1/enquiries", json={}).status_code == 404


def test_database_failure_is_not_empty_stock(client):
    from sqlalchemy.exc import OperationalError

    def broken_db():
        raise OperationalError("query", {}, Exception("secret connection string"))

    app.dependency_overrides[get_db] = broken_db
    response = client.post("/api/v1/availability/search", json={"product_id": str(UUID(int=1))})
    assert response.status_code == 503
    assert "secret" not in response.text
    assert response.json()["code"] == "SERVICE_UNAVAILABLE"
