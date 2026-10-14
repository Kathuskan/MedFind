import enum
from datetime import datetime, timezone
from sqlalchemy import String, Text, DateTime, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.db import Base


class EnquiryStatus(str, enum.Enum):
    PENDING = "PENDING"
    ANSWERED = "ANSWERED"
    REJECTED = "REJECTED"
    CLOSED = "CLOSED"


class Enquiry(Base):
    __tablename__ = "enquiries"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=True)
    pharmacy_id: Mapped[int] = mapped_column(ForeignKey("pharmacies.id"), nullable=False)
    medicine_query: Mapped[str] = mapped_column(String(255), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    response_message: Mapped[str] = mapped_column(Text, nullable=True)
    status: Mapped[EnquiryStatus] = mapped_column(
        Enum(EnquiryStatus),
        default=EnquiryStatus.PENDING,
        nullable=False
    )
    contact_phone: Mapped[str] = mapped_column(String(50), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )
    responded_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relationships
    user = relationship("User", back_populates="enquiries")
    pharmacy = relationship("Pharmacy", back_populates="enquiries")
