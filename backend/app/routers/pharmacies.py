from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.db import get_db
from app.models.pharmacy import Pharmacy
from app.schemas.pharmacy import PharmacyCreate, PharmacyResponse, PharmacyUpdate

router = APIRouter(prefix="/pharmacies", tags=["Pharmacies"])


@router.get("", response_model=List[PharmacyResponse])
async def list_pharmacies(db: AsyncSession = Depends(get_db)):
    """List all verified active pharmacies."""
    stmt = select(Pharmacy).where(Pharmacy.is_active == True)
    res = await db.execute(stmt)
    return res.scalars().all()


@router.get("/{pharmacy_id}", response_model=PharmacyResponse)
async def get_pharmacy(pharmacy_id: int, db: AsyncSession = Depends(get_db)):
    """Retrieve details for a specific pharmacy."""
    stmt = select(Pharmacy).where(Pharmacy.id == pharmacy_id)
    pharmacy = (await db.execute(stmt)).scalar_one_or_none()
    if not pharmacy:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pharmacy not found."
        )
    return pharmacy


@router.post("", response_model=PharmacyResponse, status_code=status.HTTP_201_CREATED)
async def create_pharmacy(pharmacy_in: PharmacyCreate, db: AsyncSession = Depends(get_db)):
    """Register a new pharmacy."""
    pharmacy = Pharmacy(**pharmacy_in.model_dump())
    db.add(pharmacy)
    await db.commit()
    await db.refresh(pharmacy)
    return pharmacy
