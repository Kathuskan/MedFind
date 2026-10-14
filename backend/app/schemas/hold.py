from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict
from app.models.hold import HoldStatus
from app.schemas.medicine import MedicineResponse
from app.schemas.pharmacy import PharmacyResponse


class HoldCreate(BaseModel):
    pharmacy_id: int
    medicine_id: int
    quantity: int = 1


class HoldResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    reservation_code: str
    user_id: Optional[int] = None
    pharmacy_id: int
    medicine_id: int
    quantity: int
    status: HoldStatus
    expires_at: datetime
    created_at: datetime
    medicine: Optional[MedicineResponse] = None
    pharmacy: Optional[PharmacyResponse] = None
