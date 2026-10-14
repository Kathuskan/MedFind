from datetime import datetime, timezone
from sqlalchemy import String, Boolean, DateTime, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.db import Base


class Medicine(Base):
    __tablename__ = "medicines"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    brand_name: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    generic_name: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    dosage_form: Mapped[str] = mapped_column(String(100), default="Tablet")  # Capsule, Syrup, Injection, etc.
    strength: Mapped[str] = mapped_column(String(100), nullable=True)        # 500mg, 10ml, etc.
    manufacturer: Mapped[str] = mapped_column(String(255), nullable=True)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    requires_prescription: Mapped[bool] = mapped_column(Boolean, default=True)
    is_controlled: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    stocks = relationship("Stock", back_populates="medicine", cascade="all, delete-orphan")
    holds = relationship("Hold", back_populates="medicine")
