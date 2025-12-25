from fastapi import APIRouter, HTTPException, status, Depends
from motor.motor_asyncio import AsyncIOMotorClient
from typing import List
import os

from models import Inquiry, InquiryCreate, InquiryUpdate
from auth import get_current_user

router = APIRouter(prefix="/inquiries", tags=["Contact Inquiries"])

# Database connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'rids_ngo')]

@router.get("", response_model=List[Inquiry])
async def get_inquiries(
    status_filter: str = None,
    limit: int = 100,
    current_user: dict = Depends(get_current_user)
):
    """Get all contact inquiries (admin only)."""
    query = {}
    if status_filter:
        query["status"] = status_filter
    
    inquiries = await db.inquiries.find(query).sort("created_at", -1).to_list(limit)
    return [Inquiry(**inquiry) for inquiry in inquiries]

@router.get("/stats")
async def get_inquiry_stats(current_user: dict = Depends(get_current_user)):
    """Get inquiry statistics (admin only)."""
    total = await db.inquiries.count_documents({})
    new_count = await db.inquiries.count_documents({"status": "new"})
    replied_count = await db.inquiries.count_documents({"status": "replied"})
    
    return {
        "total": total,
        "new": new_count,
        "replied": replied_count,
        "closed": total - new_count - replied_count
    }

@router.post("", response_model=Inquiry)
async def create_inquiry(inquiry: InquiryCreate):
    """Submit a contact form inquiry."""
    inquiry_obj = Inquiry(**inquiry.dict())
    inquiry_dict = inquiry_obj.dict()
    
    await db.inquiries.insert_one(inquiry_dict)
    return inquiry_obj

@router.put("/{inquiry_id}", response_model=Inquiry)
async def update_inquiry_status(
    inquiry_id: str,
    inquiry_update: InquiryUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update inquiry status (admin only)."""
    valid_statuses = ["new", "replied", "closed"]
    if inquiry_update.status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status. Must be one of: {valid_statuses}"
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
    return Inquiry(**updated)

@router.delete("/{inquiry_id}")
async def delete_inquiry(inquiry_id: str, current_user: dict = Depends(get_current_user)):
    """Delete an inquiry (admin only)."""
    result = await db.inquiries.delete_one({"id": inquiry_id})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inquiry not found"
        )
    return {"message": "Inquiry deleted successfully"}
