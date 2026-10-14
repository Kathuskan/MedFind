from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import joinedload

from app.core.db import get_db
from app.models.hold import Hold, HoldStatus
from app.schemas.hold import HoldCreate, HoldResponse
from app.services.holds import HoldService

router = APIRouter(prefix="/holds", tags=["Stock Holds & Reservations"])


@router.post("", response_model=HoldResponse, status_code=status.HTTP_201_CREATED)
async def request_hold(hold_in: HoldCreate, db: AsyncSession = Depends(get_db)):
    """Request a temporary reservation (hold) on medicine stock."""
    try:
        hold = await HoldService.create_hold(
            db=db,
            pharmacy_id=hold_in.pharmacy_id,
            medicine_id=hold_in.medicine_id,
            quantity=hold_in.quantity,
        )
        await db.commit()
        await db.refresh(hold)
        return hold
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/code/{reservation_code}", response_model=HoldResponse)
async def get_hold_by_code(reservation_code: str, db: AsyncSession = Depends(get_db)):
    """Look up a hold by reservation code (used at pharmacy checkout)."""
    stmt = (
        select(Hold)
        .where(Hold.reservation_code == reservation_code.upper())
        .options(joinedload(Hold.medicine), joinedload(Hold.pharmacy))
    )
    hold = (await db.execute(stmt)).scalar_one_or_none()
    if not hold:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reservation not found.")
    return hold


@router.get("/pharmacy/{pharmacy_id}", response_model=List[HoldResponse])
async def get_pharmacy_holds(pharmacy_id: int, db: AsyncSession = Depends(get_db)):
    """List all active and recent holds for a specific pharmacy."""
    stmt = (
        select(Hold)
        .where(Hold.pharmacy_id == pharmacy_id)
        .options(joinedload(Hold.medicine))
        .order_by(Hold.created_at.desc())
    )
    res = await db.execute(stmt)
    return res.scalars().all()


@router.post("/{hold_id}/fulfill", response_model=HoldResponse)
async def fulfill_hold(hold_id: int, db: AsyncSession = Depends(get_db)):
    """Pharmacist marks hold as fulfilled upon customer pickup."""
    stmt = select(Hold).where(Hold.id == hold_id)
    hold = (await db.execute(stmt)).scalar_one_or_none()
    if not hold:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Hold not found.")

    hold.status = HoldStatus.FULFILLED
    await db.commit()
    await db.refresh(hold)
    return hold
