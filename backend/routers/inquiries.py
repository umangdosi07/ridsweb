from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Optional
from datetime import datetime
from uuid import uuid4

from models import Inquiry, InquiryCreate, InquiryUpdate
from auth import get_current_user
from db import get_db

router = APIRouter(prefix="/inquiries", tags=["Contact Inquiries"])


# =========================
# CREATE INQUIRY (PUBLIC)
# =========================

@router.post("", response_model=Inquiry)
async def create_inquiry(inquiry: InquiryCreate):
    db = get_db()

    inquiry_doc = {
        "id": str(uuid4()),
        "name": inquiry.name,
        "email": inquiry.email,
        "phone": inquiry.phone,
        "subject": inquiry.subject,
        "message": inquiry.message,
        "status": "new",
        "created_at": datetime.utcnow()
    }

    await db.inquiries.insert_one(inquiry_doc)
    inquiry_doc.pop("_id", None)

    return Inquiry(**inquiry_doc)


# =========================
# GET ALL INQUIRIES (ADMIN)
# =========================

@router.get("", response_model=List[Inquiry])
async def get_inquiries(
    status_filter: Optional[str] = None,
    limit: int = 100,
    current_user: dict = Depends(get_current_user)
):
    db = get_db()

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


# =========================
# INQUIRY STATS (ADMIN)
# =========================

@router.get("/stats")
async def get_inquiry_stats(current_user: dict = Depends(get_current_user)):
    db = get_db()

    total = await db.inquiries.count_documents({})
    new_count = await db.inquiries.count_documents({"status": "new"})
    replied_count = await db.inquiries.count_documents({"status": "replied"})
    closed_count = await db.inquiries.count_documents({"status": "closed"})

    return {
        "total": total,
        "new": new_count,
        "replied": replied_count,
        "closed": closed_count
    }


# =========================
# UPDATE STATUS (ADMIN)
# =========================

@router.put("/{inquiry_id}", response_model=Inquiry)
async def update_inquiry_status(
    inquiry_id: str,
    inquiry_update: InquiryUpdate,
    current_user: dict = Depends(get_current_user)
):
    db = get_db()

    valid_statuses = ["new", "replied", "closed"]
    if inquiry_update.status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status. Must be one of {valid_statuses}"
        )

    result = await db.inquiries.update_one(
        {"id": inquiry_id},
        {"$set": {"status": inquiry_update.status}}
    )

    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inquiry not found"
        )

    updated = await db.inquiries.find_one({"id": inquiry_id})
    updated.pop("_id", None)

    return Inquiry(**updated)


# =========================
# DELETE INQUIRY (ADMIN)
# =========================

@router.delete("/{inquiry_id}")
async def delete_inquiry(
    inquiry_id: str,
    current_user: dict = Depends(get_current_user)
):
    db = get_db()

    result = await db.inquiries.delete_one({"id": inquiry_id})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inquiry not found"
        )

    return {"message": "Inquiry deleted successfully"}


# =========================
# HEALTH CHECK
# =========================

@router.get("/health")
async def inquiries_health():
    return {"status": "inquiries router alive"}
