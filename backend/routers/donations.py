from fastapi import APIRouter, HTTPException, status, Depends
from motor.motor_asyncio import AsyncIOMotorClient
from typing import List
import os

from models import Donation, DonationCreate
from auth import get_current_user

router = APIRouter(prefix="/donations", tags=["Donations"])

# Database connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'rids_ngo')]

@router.get("", response_model=List[Donation])
async def get_donations(
    status_filter: str = None, 
    limit: int = 100,
    current_user: dict = Depends(get_current_user)
):
    """Get all donations (admin only)."""
    query = {}
    if status_filter:
        query["status"] = status_filter
    
    donations = await db.donations.find(query).sort("created_at", -1).to_list(limit)
    return [Donation(**donation) for donation in donations]

@router.get("/stats")
async def get_donation_stats(current_user: dict = Depends(get_current_user)):
    """Get donation statistics (admin only)."""
    # Total donations
    total_pipeline = [
        {"$match": {"status": "completed"}},
        {"$group": {"_id": None, "total": {"$sum": "$amount"}, "count": {"$sum": 1}}}
    ]
    total_result = await db.donations.aggregate(total_pipeline).to_list(1)
    
    # Monthly donors
    monthly_count = await db.donations.count_documents({"type": "monthly", "status": "completed"})
    
    # Recent donations
    recent = await db.donations.find({"status": "completed"}).sort("created_at", -1).to_list(5)
    
    return {
        "total_amount": total_result[0]["total"] if total_result else 0,
        "total_count": total_result[0]["count"] if total_result else 0,
        "monthly_donors": monthly_count,
        "recent_donations": [Donation(**d) for d in recent]
    }

@router.post("", response_model=Donation)
async def create_donation(donation: DonationCreate):
    """Create a new donation record."""
    donation_obj = Donation(**donation.dict())
    donation_dict = donation_obj.dict()
    
    # For now, mark as pending until payment is processed
    # In real implementation, this would integrate with Razorpay
    donation_dict["status"] = "pending"
    
    await db.donations.insert_one(donation_dict)
    return donation_obj

@router.put("/{donation_id}/status")
async def update_donation_status(
    donation_id: str,
    status: str,
    payment_id: str = None,
    current_user: dict = Depends(get_current_user)
):
    """Update donation status (admin only or via webhook)."""
    valid_statuses = ["pending", "completed", "failed"]
    if status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status. Must be one of: {valid_statuses}"
        )
    
    update_data = {"status": status}
    if payment_id:
        update_data["payment_id"] = payment_id
    
    result = await db.donations.update_one(
        {"id": donation_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Donation not found"
        )
    
    return {"message": "Donation status updated successfully"}

# Placeholder for Razorpay integration
@router.post("/create-order")
async def create_razorpay_order(donation: DonationCreate):
    """Create a Razorpay order for payment.
    
    This endpoint will be fully implemented when Razorpay keys are provided.
    For now, it creates a mock order.
    """
    # Create donation record
    donation_obj = Donation(**donation.dict())
    donation_dict = donation_obj.dict()
    await db.donations.insert_one(donation_dict)
    
    # Mock order response
    # In real implementation, this would call Razorpay API
    return {
        "order_id": f"order_mock_{donation_obj.id[:8]}",
        "donation_id": donation_obj.id,
        "amount": donation.amount,
        "currency": "INR",
        "status": "created",
        "note": "Razorpay integration pending. This is a mock order."
    }

@router.post("/webhook")
async def razorpay_webhook(payload: dict):
    """Handle Razorpay webhook for payment confirmation.
    
    This endpoint will be fully implemented when Razorpay keys are provided.
    """
    # In real implementation, verify webhook signature and update donation status
    return {"status": "received", "note": "Webhook handler ready for Razorpay integration"}
