import unicodedata
from datetime import UTC, datetime
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, text
from sqlalchemy.orm import Session

from app.api.schemas import (
    AvailabilityInput,
    AvailabilityItem,
    AvailabilityOutput,
    PharmacyOutput,
    ProductOutput,
    SearchInput,
)
from app.config import get_settings
from app.db.models import Pharmacy, Product, StockReport
from app.db.session import get_db
from app.domain.availability import as_utc, stock_state

router = APIRouter(prefix="/api/v1")
Database = Annotated[Session, Depends(get_db)]


def normalize(value: str) -> str:
    return " ".join(unicodedata.normalize("NFKC", value).casefold().split())


@router.get("/health/live")
def live():
    return {"status": "ok", "version": "0.1.0", "demo_mode": get_settings().demo_mode}


@router.get("/health/ready")
def ready(db: Database):
    db.execute(text("SELECT 1"))
    db.execute(select(Product.id).limit(1))
    return {"status": "ready"}


@router.post("/catalogue/search", response_model=list[ProductOutput])
def catalogue(body: SearchInput, db: Database):
    query = normalize(body.query)
    if len(query) < 2:
        return []
    # The pilot catalogue is deliberately small. A reviewed alias table follows later.
    products = db.scalars(select(Product).where(Product.active.is_(True))).all()
    matches = [
        p
        for p in products
        if normalize(p.name).startswith(query) or (p.brand and normalize(p.brand).startswith(query))
    ]
    return sorted(matches, key=lambda p: (normalize(p.name) != query, p.name, p.strength))[:20]


@router.get("/towns", response_model=list[str])
def towns(db: Database):
    return list(
        db.scalars(
            select(Pharmacy.town)
            .where(
                Pharmacy.active.is_(True),
                Pharmacy.verified.is_(True),
                Pharmacy.is_demo.is_(get_settings().demo_mode),
            )
            .distinct()
            .order_by(Pharmacy.town)
        )
    )


@router.post("/availability/search", response_model=AvailabilityOutput)
def availability(body: AvailabilityInput, db: Database):
    product = db.get(Product, body.product_id)
    if product is None or not product.active:
        raise HTTPException(404, "Medicine is not in the active catalogue")
    now = datetime.now(UTC)
    query = (
        select(StockReport, Pharmacy)
        .join(Pharmacy)
        .where(
            StockReport.product_id == product.id,
            Pharmacy.active.is_(True),
            Pharmacy.verified.is_(True),
            Pharmacy.is_demo.is_(get_settings().demo_mode),
        )
    )
    if body.town:
        query = query.where(Pharmacy.town == body.town)
    items = []
    for report, pharmacy in db.execute(query):
        status, expires = stock_state(
            report.status, report.confirmed_at, report.unresolved_discrepancy, now
        )
        items.append(
            AvailabilityItem(
                pharmacy=PharmacyOutput.model_validate(pharmacy),
                status=status,
                confirmed_at=as_utc(report.confirmed_at) if report.confirmed_at else None,
                freshness_expires_at=expires,
            )
        )
    priority = {"IN_STOCK": 0, "LOW": 1, "UNCONFIRMED": 2, "UNKNOWN": 3, "OUT": 4}
    items.sort(
        key=lambda i: (
            priority[i.status],
            -(i.confirmed_at.timestamp() if i.confirmed_at else 0),
            str(i.pharmacy.id),
        )
    )
    return AvailabilityOutput(
        product=ProductOutput.model_validate(product),
        items=items,
        server_now=now,
        demo_mode=get_settings().demo_mode,
    )


@router.get("/pharmacies/{pharmacy_id}", response_model=PharmacyOutput)
def pharmacy_detail(pharmacy_id: UUID, db: Database):
    pharmacy = db.get(Pharmacy, pharmacy_id)
    if (
        not pharmacy
        or not pharmacy.active
        or not pharmacy.verified
        or pharmacy.is_demo != get_settings().demo_mode
    ):
        raise HTTPException(404, "Pharmacy is not available")
    return pharmacy
