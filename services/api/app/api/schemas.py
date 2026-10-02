from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class SearchInput(BaseModel):
    model_config = ConfigDict(extra="forbid")
    query: str = Field(min_length=2, max_length=100)


class AvailabilityInput(BaseModel):
    model_config = ConfigDict(extra="forbid")
    product_id: UUID
    town: str | None = Field(default=None, max_length=80)


class ProductOutput(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    name: str
    strength: str
    form: str
    brand: str | None


class PharmacyOutput(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    name: str
    town: str
    address: str
    phone: str | None
    is_demo: bool


class AvailabilityItem(BaseModel):
    pharmacy: PharmacyOutput
    status: Literal["IN_STOCK", "LOW", "OUT", "UNKNOWN", "UNCONFIRMED"]
    confirmed_at: datetime | None
    freshness_expires_at: datetime | None


class AvailabilityOutput(BaseModel):
    product: ProductOutput
    items: list[AvailabilityItem]
    server_now: datetime
    demo_mode: bool
