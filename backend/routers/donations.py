from fastapi import APIRouter, HTTPException, status, Depends, Request
from motor.motor_asyncio import AsyncIOMotorClient
from typing import List
import os
import razorpay
import hmac
import hashlib

from models import Donation, DonationCreate
from auth import get_current_user

router = APIRouter(prefix="/donations", tags=["Donations"])

# Database connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'rids_ngo')]

# Razorpay client
RAZORPAY_KEY_ID = os.environ.get('RAZORPAY_KEY_ID')
RAZORPAY_KEY_SECRET = os.environ.get('RAZORPAY_KEY_SECRET')

razorpay_client = None
if RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET:
    razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

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
    donation_dict["status"] = "pending"
    
    await db.donations.insert_one(donation_dict)
    return donation_obj

@router.post("/create-order")
async def create_razorpay_order(donation: DonationCreate):
    """Create a Razorpay order for payment."""
    
    if not razorpay_client:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Payment gateway not configured"
        )
    
    # Create donation record
    donation_obj = Donation(**donation.dict())
    donation_dict = donation_obj.dict()
    donation_dict["status"] = "pending"
    await db.donations.insert_one(donation_dict)
    
    try:
        # Create Razorpay order (amount in paise)
        order_data = {
            "amount": int(donation.amount * 100),  # Convert to paise
            "currency": "INR",
            "receipt": donation_obj.id,
            "payment_capture": 1,  # Auto capture
            "notes": {
                "donor_name": donation.name,
                "donor_email": donation.email,
                "donor_phone": donation.phone,
                "donation_type": donation.type,
                "donation_id": donation_obj.id
            }
        }
        
        razorpay_order = razorpay_client.order.create(data=order_data)
        
        # Update donation with order ID
        await db.donations.update_one(
            {"id": donation_obj.id},
            {"$set": {"razorpay_order_id": razorpay_order["id"]}}
        )
        
        return {
            "order_id": razorpay_order["id"],
            "donation_id": donation_obj.id,
            "amount": donation.amount,
            "amount_paise": razorpay_order["amount"],
            "currency": razorpay_order["currency"],
            "key_id": RAZORPAY_KEY_ID,
            "status": "created",
            "donor": {
                "name": donation.name,
                "email": donation.email,
                "phone": donation.phone
            }
        }
        
    except Exception as e:
        # Update donation status to failed
        await db.donations.update_one(
            {"id": donation_obj.id},
            {"$set": {"status": "failed", "error": str(e)}}
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create payment order: {str(e)}"
        )

@router.post("/verify-payment")
async def verify_payment(
    razorpay_order_id: str,
    razorpay_payment_id: str,
    razorpay_signature: str,
    donation_id: str
):
    """Verify Razorpay payment and update donation status."""
    
    if not razorpay_client:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Payment gateway not configured"
        )
    
    try:
        # Verify signature
        params_dict = {
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_signature': razorpay_signature
        }
        
        # Verify signature using Razorpay SDK
        razorpay_client.utility.verify_payment_signature(params_dict)
        
        # Payment verified successfully - update donation status
        await db.donations.update_one(
            {"id": donation_id},
            {
                "$set": {
                    "status": "completed",
                    "payment_id": razorpay_payment_id,
                    "razorpay_signature": razorpay_signature
                }
            }
        )
        
        return {
            "status": "success",
            "message": "Payment verified successfully",
            "donation_id": donation_id,
            "payment_id": razorpay_payment_id
        }
        
    except razorpay.errors.SignatureVerificationError:
        # Signature verification failed
        await db.donations.update_one(
            {"id": donation_id},
            {"$set": {"status": "failed", "error": "Signature verification failed"}}
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Payment verification failed"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Payment verification error: {str(e)}"
        )

@router.put("/{donation_id}/status")
async def update_donation_status(
    donation_id: str,
    new_status: str,
    payment_id: str = None,
    current_user: dict = Depends(get_current_user)
):
    """Update donation status (admin only or via webhook)."""
    valid_statuses = ["pending", "completed", "failed"]
    if new_status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status. Must be one of: {valid_statuses}"
        )
    
    update_data = {"status": new_status}
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

@router.post("/webhook")
async def razorpay_webhook(request: Request):
    """Handle Razorpay webhook for payment events."""
    
    if not razorpay_client:
        return {"status": "ignored", "reason": "Payment gateway not configured"}
    
    try:
        payload = await request.json()
        event = payload.get("event")
        
        if event == "payment.captured":
            payment = payload.get("payload", {}).get("payment", {}).get("entity", {})
            order_id = payment.get("order_id")
            payment_id = payment.get("id")
            
            # Find and update donation by order ID
            await db.donations.update_one(
                {"razorpay_order_id": order_id},
                {
                    "$set": {
                        "status": "completed",
                        "payment_id": payment_id
                    }
                }
            )
            
        elif event == "payment.failed":
            payment = payload.get("payload", {}).get("payment", {}).get("entity", {})
            order_id = payment.get("order_id")
            
            await db.donations.update_one(
                {"razorpay_order_id": order_id},
                {"$set": {"status": "failed"}}
            )
        
        return {"status": "processed", "event": event}
        
    except Exception as e:
        return {"status": "error", "message": str(e)}
