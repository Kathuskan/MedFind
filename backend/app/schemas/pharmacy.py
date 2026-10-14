from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, ConfigDict


class PharmacyBase(BaseModel):
    name: str
    license_number: str
    address: str
    city: str
    postal_code: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    phone: str
    email: Optional[str] = None
    opening_hours: str = "08:00 - 20:00"


class PharmacyCreate(PharmacyBase):
    pass


class PharmacyUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    opening_hours: Optional[str] = None
    is_active: Optional[bool] = None


class PharmacyResponse(PharmacyBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    owner_id: Optional[int] = None
    is_verified: bool
    is_active: bool
    created_at: datetime
    distance_km: Optional[float] = None
