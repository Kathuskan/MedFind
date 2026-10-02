"""Explicit, idempotent synthetic fixtures. Never refresh timestamps on API startup."""

from datetime import UTC, datetime, timedelta
from uuid import UUID

from sqlalchemy import select

from app.config import get_settings
from app.db.models import Pharmacy, Product, StockReport
from app.db.session import SessionLocal


def seed():
    if not get_settings().demo_mode:
        raise RuntimeError("Synthetic seed is disabled when DEMO_MODE=false")
    with SessionLocal.begin() as db:
        if db.scalar(select(Product.id).limit(1)):
            print("Catalogue already populated; no records or timestamps changed.")
            return
        products = [
            Product(id=UUID(int=1), name="Metformin", strength="500 mg", form="Tablet", brand=None),
            Product(id=UUID(int=2), name="Metformin", strength="850 mg", form="Tablet", brand=None),
            Product(id=UUID(int=3), name="Amlodipine", strength="5 mg", form="Tablet", brand=None),
            Product(id=UUID(int=4), name="Losartan", strength="50 mg", form="Tablet", brand=None),
        ]
        pharmacies = [
            Pharmacy(
                id=UUID(int=101 + i),
                name=name,
                town=town,
                address="Synthetic location · demonstration only",
                phone=None,
                verified=True,
                is_demo=True,
            )
            for i, (name, town) in enumerate(
                [
                    ("Demo Central Pharmacy", "Colombo"),
                    ("Demo Lake Pharmacy", "Colombo"),
                    ("Demo North Pharmacy", "Jaffna"),
                    ("Demo East Pharmacy", "Batticaloa"),
                ]
            )
        ]
        db.add_all(products + pharmacies)
        db.flush()
        now = datetime.now(UTC)
        for product in products:
            for i, pharmacy in enumerate(pharmacies):
                db.add(
                    StockReport(
                        pharmacy_id=pharmacy.id,
                        product_id=product.id,
                        status=["IN_STOCK", "LOW", "IN_STOCK", "OUT"][i],
                        confirmed_at=now - timedelta(hours=[1, 3, 26, 2][i]),
                    )
                )
        print("Added 4 demo medicines, 4 fictional pharmacies and 16 stock reports.")


if __name__ == "__main__":
    seed()
