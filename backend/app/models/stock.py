import enum
from datetime import datetime, timezone
from sqlalchemy import Integer, Float, DateTime, ForeignKey, Enum, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.db import Base


class StockStatus(str, enum.Enum):
    IN_STOCK = "IN_STOCK"
    LOW_STOCK = "LOW_STOCK"
    OUT_OF_STOCK = "OUT_OF_STOCK"


class Stock(Base):
    __tablename__ = "stocks"
    __table_args__ = (
        UniqueConstraint("pharmacy_id", "medicine_id", name="uq_pharmacy_medicine"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    pharmacy_id: Mapped[int] = mapped_column(ForeignKey("pharmacies.id"), nullable=False)
    medicine_id: Mapped[int] = mapped_column(ForeignKey("medicines.id"), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    unit_price: Mapped[float] = mapped_column(Float, nullable=True)
    status: Mapped[StockStatus] = mapped_column(
        Enum(StockStatus),
        default=StockStatus.OUT_OF_STOCK,
        nullable=False
    )
    last_updated: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    pharmacy = relationship("Pharmacy", back_populates="stocks")
    medicine = relationship("Medicine", back_populates="stocks")
