from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.core.db import get_db
from app.models.user import User
from app.models.pharmacy import Pharmacy
from app.models.stock import Stock
from app.models.hold import Hold, HoldStatus
from app.schemas.user import UserResponse
from app.services.retention import RetentionService

router = APIRouter(prefix="/admin", tags=["Administration"])


@router.get("/stats")
async def get_system_stats(db: AsyncSession = Depends(get_db)) -> Dict[str, Any]:
    """Retrieve aggregate platform metrics."""
    users_count = await db.scalar(select(func.count(User.id)))
    pharmacies_count = await db.scalar(select(func.count(Pharmacy.id)))
    stocks_count = await db.scalar(select(func.count(Stock.id)))
    active_holds_count = await db.scalar(
        select(func.count(Hold.id)).where(Hold.status == HoldStatus.ACTIVE)
    )

    return {
        "total_users": users_count or 0,
        "total_pharmacies": pharmacies_count or 0,
        "tracked_stock_items": stocks_count or 0,
        "active_holds": active_holds_count or 0,
    }


@router.get("/users", response_model=List[UserResponse])
async def list_users(db: AsyncSession = Depends(get_db)):
    """List registered users for administration."""
    stmt = select(User).order_by(User.created_at.desc()).limit(100)
    res = await db.execute(stmt)
    return res.scalars().all()


@router.post("/retention/purge")
async def trigger_privacy_retention_purge(db: AsyncSession = Depends(get_db)):
    """Manually invoke the retention pruning routine."""
    result = await RetentionService.purge_expired_records(db)
    await db.commit()
    return result
