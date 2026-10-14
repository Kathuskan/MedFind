from datetime import datetime, timezone
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.db import get_db
from app.models.enquiry import Enquiry, EnquiryStatus
from app.schemas.enquiry import EnquiryCreate, EnquiryRespond, EnquiryResponse

router = APIRouter(prefix="/enquiries", tags=["Enquiries"])


@router.post("", response_model=EnquiryResponse, status_code=status.HTTP_201_CREATED)
async def submit_enquiry(enquiry_in: EnquiryCreate, db: AsyncSession = Depends(get_db)):
    """Patient submits an enquiry regarding a medicine to a pharmacy."""
    enquiry = Enquiry(
        pharmacy_id=enquiry_in.pharmacy_id,
        medicine_query=enquiry_in.medicine_query,
        message=enquiry_in.message,
        contact_phone=enquiry_in.contact_phone,
        status=EnquiryStatus.PENDING,
    )
    db.add(enquiry)
    await db.commit()
    await db.refresh(enquiry)
    return enquiry


@router.get("/pharmacy/{pharmacy_id}", response_model=List[EnquiryResponse])
async def get_pharmacy_enquiries(pharmacy_id: int, db: AsyncSession = Depends(get_db)):
    """Pharmacy staff retrieves all incoming customer inquiries."""
    stmt = (
        select(Enquiry)
        .where(Enquiry.pharmacy_id == pharmacy_id)
        .order_by(Enquiry.created_at.desc())
    )
    res = await db.execute(stmt)
    return res.scalars().all()


@router.patch("/{enquiry_id}/respond", response_model=EnquiryResponse)
async def respond_to_enquiry(
    enquiry_id: int,
    payload: EnquiryRespond,
    db: AsyncSession = Depends(get_db),
):
    """Pharmacy answers or updates status of an enquiry."""
    stmt = select(Enquiry).where(Enquiry.id == enquiry_id)
    enquiry = (await db.execute(stmt)).scalar_one_or_none()
    if not enquiry:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Enquiry not found.")

    enquiry.response_message = payload.response_message
    enquiry.status = payload.status
    enquiry.responded_at = datetime.now(timezone.utc)

    await db.commit()
    await db.refresh(enquiry)
    return enquiry
