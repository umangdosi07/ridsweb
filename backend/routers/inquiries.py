from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Optional
from datetime import datetime
from uuid import uuid4
import os

from motor.motor_asyncio import AsyncIOMotorClient

from models import Inquiry, InquiryCreate, InquiryUpdate
from auth import get_current_user

# ======================================================
# ROUTER
# ======================================================
router = APIRouter(
    prefix="/inquiries",
    tags=["Contact Inquiries"]
)

# ======================================================
# DATABASE
# ======================================================
MONGO_URL = os.getenv("MONGO_URL")
DB_NAME = os.getenv("DB_NAME", "rids_ngo")

if not MONGO_URL:
    raise RuntimeError("MONGO_URL is not set")

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

# ======================================================
# HEALTH CHECK
# ======================================================
@router.get("/health")
def inquiries_health():
    return {"status": "inquiries router alive"}

# ======================================================
# CREATE INQUIRY (PUBLIC – CONTACT FORM)
# ======================================================
@router.post("", response_model=Inquiry, status_code=status.HTTP_201_CREATED)
async def create_inquiry(inquiry: InquiryCreate):
    inquiry_doc = {
        "id": str(uuid4()),
        "name": inquiry.name,
        "email": inquiry.email,
        "phone": inquiry.phone,
        "subject": inquiry.subject,
        "message": inquiry.message,
        "status": "new",
        "created_at": datetime.utcnow(),
    }

    await db.inquiries.insert_one(inquiry_doc)

    inquiry_doc.pop("_id", None)
    return Inquiry(**inquiry_doc)

# ======================================================
# GET ALL INQUIRIES (ADMIN ONLY)
# ======================================================
@router.get("", response_model=List[Inquiry])
async def get_inquiries(
    status_filter: Optional[str] = None,
    limit: int = 100,
    current_user: dict = Depends(get_current_user)
):
    query = {}
    if status_filter:
        query["status"] = status_filter

    inquiries = (
        await db.inquiries
        .find(query)
        .sort("created_at", -1)
        .to_list(limit)
    )

    for i in inquiries:
        i.pop("_id", None)

    return [Inquiry(**i) for i in inquiries]

# ======================================================
# UPDATE INQUIRY STATUS (ADMIN ONLY)
# ======================================================
@router.put("/{inquiry_id}", response_model=Inquiry)
async def update_inquiry_status(
    inquiry_id: str,
    inquiry_update: InquiryUpdate,
    current_user: dict = Depends(get_current_user)
):
    valid_statuses = ["new", "replied", "closed"]
    if inquiry_update.status not in valid_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Status must be one of {valid_statuses}"
        )

    result = await db.inquiries.update_one(
        {"id": inquiry_id},
        {"$set": {"status": inquiry_update.status}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Inquiry not found")

    updated = await db.inquiries.find_one({"id": inquiry_id})
    updated.pop("_id", None)
    return Inquiry(**updated)

# ======================================================
# DELETE INQUIRY (ADMIN ONLY)
# ======================================================
@router.delete("/{inquiry_id}")
async def delete_inquiry(
    inquiry_id: str,
    current_user: dict = Depends(get_current_user)
):
    result = await db.inquiries.delete_one({"id": inquiry_id})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Inquiry not found")

    return {"message": "Inquiry deleted successfully"}
