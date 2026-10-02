from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import Boolean, CheckConstraint, DateTime, ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.db.session import Base


class Product(Base):
    __tablename__ = "products"
    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    name: Mapped[str] = mapped_column(String(120))
    strength: Mapped[str] = mapped_column(String(40))
    form: Mapped[str] = mapped_column(String(80))
    brand: Mapped[str | None] = mapped_column(String(120))
    active: Mapped[bool] = mapped_column(Boolean, default=True)


class Pharmacy(Base):
    __tablename__ = "pharmacies"
    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    name: Mapped[str] = mapped_column(String(160))
    town: Mapped[str] = mapped_column(String(80), index=True)
    address: Mapped[str] = mapped_column(String(240))
    phone: Mapped[str | None] = mapped_column(String(24))
    verified: Mapped[bool] = mapped_column(Boolean, default=False)
    active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_demo: Mapped[bool] = mapped_column(Boolean, default=True)


class StockReport(Base):
    __tablename__ = "stock_reports"
    __table_args__ = (
        UniqueConstraint("pharmacy_id", "product_id", name="uq_stock_pair"),
        CheckConstraint("status IN ('IN_STOCK','LOW','OUT','UNKNOWN')", name="ck_stock_status"),
    )
    id: Mapped[UUID] = mapped_column(primary_key=True, default=uuid4)
    pharmacy_id: Mapped[UUID] = mapped_column(ForeignKey("pharmacies.id"))
    product_id: Mapped[UUID] = mapped_column(ForeignKey("products.id"))
    status: Mapped[str] = mapped_column(String(16))
    confirmed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    unresolved_discrepancy: Mapped[bool] = mapped_column(Boolean, default=False)
