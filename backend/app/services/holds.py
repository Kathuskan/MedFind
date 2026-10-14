import secrets
import string
from datetime import datetime, timedelta, timezone
from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_

from app.core.config import settings
from app.models.hold import Hold, HoldStatus
from app.models.stock import Stock
from app.models.medicine import Medicine
from app.services.stock_status import StockStatusService


class HoldService:
    """Service managing transient stock reservations and auto-expiration."""

    @staticmethod
    def generate_reservation_code(length: int = 8) -> str:
        """Generate a random human-readable alphanumeric code, e.g. MF-7K9A2X"""
        chars = string.ascii_uppercase + string.digits
        random_str = "".join(secrets.choice(chars) for _ in range(length))
        return f"MF-{random_str}"

    @classmethod
    async def create_hold(
        cls,
        db: AsyncSession,
        pharmacy_id: int,
        medicine_id: int,
        quantity: int = 1,
        user_id: Optional[int] = None,
        duration_minutes: Optional[int] = None,
    ) -> Hold:
        # Check medicine eligibility
        medicine_stmt = select(Medicine).where(Medicine.id == medicine_id)
        res = await db.execute(medicine_stmt)
        med = res.scalar_one_or_none()
        if not med:
            raise ValueError("Medicine not found")

        if med.is_controlled:
            raise ValueError("Controlled substances cannot be reserved online.")

        # Check stock availability
        stock_stmt = select(Stock).where(
            and_(Stock.pharmacy_id == pharmacy_id, Stock.medicine_id == medicine_id)
        )
        res = await db.execute(stock_stmt)
        stock = res.scalar_one_or_none()
        if not stock or stock.quantity < quantity:
            raise ValueError("Insufficient stock for reservation.")

        # Decrement stock and update status
        stock.quantity -= quantity
        stock.status = StockStatusService.calculate_status(stock.quantity)

        # Set expiry
        mins = duration_minutes or settings.DEFAULT_HOLD_EXPIRY_MINUTES
        expires_at = datetime.now(timezone.utc) + timedelta(minutes=mins)

        hold = Hold(
            reservation_code=cls.generate_reservation_code(),
            user_id=user_id,
            pharmacy_id=pharmacy_id,
            medicine_id=medicine_id,
            quantity=quantity,
            status=HoldStatus.ACTIVE,
            expires_at=expires_at,
        )
        db.add(hold)
        await db.flush()
        return hold

    @classmethod
    async def expire_stale_holds(cls, db: AsyncSession) -> int:
        """Find active holds past their expiry, mark them EXPIRED and restore stock."""
        now = datetime.now(timezone.utc)
        stmt = select(Hold).where(
            and_(Hold.status == HoldStatus.ACTIVE, Hold.expires_at <= now)
        )
        res = await db.execute(stmt)
        stale_holds = res.scalars().all()

        count = 0
        for hold in stale_holds:
            hold.status = HoldStatus.EXPIRED
            # Restore stock
            stock_stmt = select(Stock).where(
                and_(Stock.pharmacy_id == hold.pharmacy_id, Stock.medicine_id == hold.medicine_id)
            )
            stock_res = await db.execute(stock_stmt)
            stock = stock_res.scalar_one_or_none()
            if stock:
                stock.quantity += hold.quantity
                stock.status = StockStatusService.calculate_status(stock.quantity)
            count += 1

        if count > 0:
            await db.flush()
        return count
