from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict
from app.models.enquiry import EnquiryStatus


class EnquiryCreate(BaseModel):
    pharmacy_id: int
    medicine_query: str
    message: str
    contact_phone: Optional[str] = None


class EnquiryRespond(BaseModel):
    response_message: str
    status: EnquiryStatus = EnquiryStatus.ANSWERED


class EnquiryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: Optional[int] = None
    pharmacy_id: int
    medicine_query: str
    message: str
    response_message: Optional[str] = None
    status: EnquiryStatus
    contact_phone: Optional[str] = None
    created_at: datetime
    responded_at: Optional[datetime] = None
