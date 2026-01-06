from fastapi import APIRouter, HTTPException, status, Depends, Request
from motor.motor_asyncio import AsyncIOMotorClient
from typing import List
import os
import razorpay
import logging

from models import Donation, DonationCreate
from auth import get_current_user

router = APIRouter(prefix="/donations", tags=["Donations"])

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database connection
mongo_url = os.environ.get('MONGO_URL')
if not mongo_url:
    logger.error("MONGO_URL not set in environment variables.")
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'rids_ngo')]

# Razorpay client
RAZORPAY_KEY_ID = os.environ.get('RAZORPAY_KEY_ID')
RAZORPAY_KEY_SECRET = os.environ.get('RAZORPAY_KEY_SECRET')

if not RAZORPAY_KEY_ID or not RAZORPAY_KEY_SECRET:
    logger.warning("Razorpay keys are not set. Payment gateway will not work.")
    razorpay_client = None
else:
    razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

# ================== Endpoints ==================

@router.post("/create-order")
async def create_razorpay_order(donation: DonationCreate):
    """Create a Razorpay order for payment."""
    if not razorpay_client:
        logger.error("Payment gateway not configured")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Payment gateway not configured"
        )

    # Create donation record
    donation_obj = Donation(**donation.dict())
    donation_dict = donation_obj.dict()
    donation_dict["status"] = "pending"

    await db.donations.insert_one(donation_dict)
    logger.info(f"Created donation record with ID: {donation_obj.id}")

    try:
        # Create Razorpay order (amount in paise)
        amount_paise = int(donation.amount * 100)
        order_data = {
            "amount": amount_paise,
            "currency": "INR",
            "receipt": donation_obj.id,
            "payment_capture": 1,
            "notes": {
                "donor_name": donation.name,
                "donor_email": donation.email,
                "donor_phone": donation.phone,
                "donation_type": donation.type,
                "donation_id": donation_obj.id
            }
        }

        logger.info(f"Creating Razorpay order for donation {donation_obj.id}")
        razorpay_order = razorpay_client.order.create(data=order_data)
        logger.info(f"Razorpay order created: {razorpay_order}")

        # Update donation with Razorpay order ID
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
        logger.error(f"Failed to create Razorpay order: {str(e)}", exc_info=True)
        # Update donation status to failed
        await db.donations.update_one(
            {"id": donation_obj.id},
            {"$set": {"status": "failed", "error": str(e)}}
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create payment order: {str(e)}"
        )
