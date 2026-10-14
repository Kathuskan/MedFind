from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict
from app.models.stock import StockStatus
from app.schemas.medicine import MedicineResponse


class StockBase(BaseModel):
    pharmacy_id: int
    medicine_id: int
    quantity: int = 0
    unit_price: Optional[float] = None
    status: StockStatus = StockStatus.OUT_OF_STOCK


class StockCreate(StockBase):
    pass


class StockUpdate(BaseModel):
    quantity: Optional[int] = None
    unit_price: Optional[float] = None
    status: Optional[StockStatus] = None


class StockResponse(StockBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    last_updated: datetime
    medicine: Optional[MedicineResponse] = None


class StockPublicView(BaseModel):
    pharmacy_id: int
    pharmacy_name: str
    pharmacy_address: str
    city: str
    phone: str
    distance_km: Optional[float] = None
    medicine_id: int
    brand_name: str
    generic_name: str
    dosage_form: str
    strength: Optional[str] = None
    status: StockStatus
    last_updated: datetime
