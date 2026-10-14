from datetime import datetime, timedelta, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import delete, and_

from app.core.config import settings
from app.models.enquiry import Enquiry, EnquiryStatus
from app.models.hold import Hold, HoldStatus


class RetentionService:
    """Service to automatically prune and sanitize old records to ensure privacy compliance."""

    @classmethod
    async def purge_expired_records(cls, db: AsyncSession) -> dict:
        """Purge old enquiries and cancelled/expired holds according to privacy policy."""
        now = datetime.now(timezone.utc)
        
        # Enquiries older than retention threshold
        enquiry_cutoff = now - timedelta(days=settings.DATA_RETENTION_DAYS)
        enquiry_stmt = delete(Enquiry).where(
            and_(
                Enquiry.created_at <= enquiry_cutoff,
                Enquiry.status.in_([EnquiryStatus.ANSWERED, EnquiryStatus.CLOSED, EnquiryStatus.REJECTED]),
            )
        )
        enquiry_res = await db.execute(enquiry_stmt)

        # Holds older than retention threshold
        hold_cutoff = now - timedelta(days=settings.DATA_RETENTION_DAYS)
        hold_stmt = delete(Hold).where(
            and_(
                Hold.created_at <= hold_cutoff,
                Hold.status.in_([HoldStatus.EXPIRED, HoldStatus.CANCELLED, HoldStatus.FULFILLED]),
            )
        )
        hold_res = await db.execute(hold_stmt)

        await db.flush()

        return {
            "purged_enquiries": enquiry_res.rowcount,
            "purged_holds": hold_res.rowcount,
            "timestamp": now.isoformat(),
        }
