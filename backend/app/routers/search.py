from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from sqlalchemy.orm import joinedload

from app.core.db import get_db
from app.models.medicine import Medicine
from app.models.pharmacy import Pharmacy
from app.models.stock import Stock
from app.schemas.stock import StockPublicView

router = APIRouter(prefix="/search", tags=["Search"])


@router.get("", response_model=List[StockPublicView])
async def search_medicine(
    q: str = Query(..., min_length=2, description="Medicine brand or generic name"),
    city: Optional[str] = Query(None, description="Filter by city name"),
    db: AsyncSession = Depends(get_db),
):
    """Search for medicine availability across nearby pharmacies with discrete status."""
    query_str = f"%{q.strip().lower()}%"

    stmt = (
        select(Stock)
        .join(Stock.medicine)
        .join(Stock.pharmacy)
        .options(joinedload(Stock.medicine), joinedload(Stock.pharmacy))
        .where(
            or_(
                Medicine.brand_name.ilike(query_str),
                Medicine.generic_name.ilike(query_str),
            )
        )
    )

    if city:
        stmt = stmt.where(Pharmacy.city.ilike(f"%{city.strip()}%"))

    result = await db.execute(stmt)
    stocks = result.scalars().all()

    response: List[StockPublicView] = []
    for s in stocks:
        response.append(
            StockPublicView(
                pharmacy_id=s.pharmacy_id,
                pharmacy_name=s.pharmacy.name,
                pharmacy_address=s.pharmacy.address,
                city=s.pharmacy.city,
                phone=s.pharmacy.phone,
                medicine_id=s.medicine_id,
                brand_name=s.medicine.brand_name,
                generic_name=s.medicine.generic_name,
                dosage_form=s.medicine.dosage_form,
                strength=s.medicine.strength,
                status=s.status,
                last_updated=s.last_updated,
            )
        )

    return response


@router.get("/suggestions")
async def get_medicine_suggestions(
    q: str = Query(..., min_length=1, description="Prefix or search keyword for medicines"),
    db: AsyncSession = Depends(get_db),
):
    """Return matching medicines for live search typeahead and autocomplete."""
    term = q.strip()
    prefix = f"{term}%"
    contains = f"%{term}%"

    stmt = (
        select(Medicine)
        .where(
            or_(
                Medicine.brand_name.ilike(prefix),
                Medicine.generic_name.ilike(prefix),
                Medicine.brand_name.ilike(contains),
                Medicine.generic_name.ilike(contains),
            )
        )
        .limit(12)
    )
    result = await db.execute(stmt)
    medicines = result.scalars().all()

    return [
        {
            "id": m.id,
            "brand_name": m.brand_name,
            "generic_name": m.generic_name,
            "dosage_form": m.dosage_form,
            "strength": m.strength,
            "full_name": f"{m.brand_name} {m.strength}",
        }
        for m in medicines
    ]
