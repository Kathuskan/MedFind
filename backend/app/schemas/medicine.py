from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class MedicineBase(BaseModel):
    brand_name: str
    generic_name: str
    dosage_form: str = "Tablet"
    strength: Optional[str] = None
    manufacturer: Optional[str] = None
    description: Optional[str] = None
    requires_prescription: bool = True
    is_controlled: bool = False


class MedicineCreate(MedicineBase):
    pass


class MedicineResponse(MedicineBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
