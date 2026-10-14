from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from sqlalchemy.orm import joinedload

from app.core.db import get_db
from app.models.stock import Stock
from app.schemas.stock import StockCreate, StockResponse, StockUpdate
from app.services.stock_status import StockStatusService

router = APIRouter(prefix="/stock", tags=["Stock Management"])


@router.get("/pharmacy/{pharmacy_id}", response_model=List[StockResponse])
async def get_pharmacy_stock(pharmacy_id: int, db: AsyncSession = Depends(get_db)):
    """Fetch complete stock catalog for a given pharmacy."""
    stmt = (
        select(Stock)
        .where(Stock.pharmacy_id == pharmacy_id)
        .options(joinedload(Stock.medicine))
    )
    res = await db.execute(stmt)
    return res.scalars().all()


@router.post("", response_model=StockResponse, status_code=status.HTTP_201_CREATED)
async def create_or_update_stock(stock_in: StockCreate, db: AsyncSession = Depends(get_db)):
    """Add or update stock quantity and status for a pharmacy."""
    stmt = select(Stock).where(
        and_(
            Stock.pharmacy_id == stock_in.pharmacy_id,
            Stock.medicine_id == stock_in.medicine_id
        )
    )
    existing = (await db.execute(stmt)).scalar_one_or_none()

    computed_status = StockStatusService.calculate_status(stock_in.quantity)

    if existing:
        existing.quantity = stock_in.quantity
        existing.unit_price = stock_in.unit_price
        existing.status = computed_status
        await db.commit()
        await db.refresh(existing)
        return existing

    stock = Stock(
        pharmacy_id=stock_in.pharmacy_id,
        medicine_id=stock_in.medicine_id,
        quantity=stock_in.quantity,
        unit_price=stock_in.unit_price,
        status=computed_status,
    )
    db.add(stock)
    await db.commit()
    await db.refresh(stock)
    return stock


@router.patch("/{stock_id}", response_model=StockResponse)
async def update_stock(stock_id: int, stock_update: StockUpdate, db: AsyncSession = Depends(get_db)):
    """Partially update stock item quantity or status."""
    stmt = select(Stock).where(Stock.id == stock_id)
    stock = (await db.execute(stmt)).scalar_one_or_none()
    if not stock:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Stock record not found.")

    if stock_update.quantity is not None:
        stock.quantity = stock_update.quantity
        stock.status = StockStatusService.calculate_status(stock.quantity)

    if stock_update.unit_price is not None:
        stock.unit_price = stock_update.unit_price

    if stock_update.status is not None:
        stock.status = stock_update.status

    await db.commit()
    await db.refresh(stock)
    return stock
