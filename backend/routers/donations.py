from fastapi import APIRouter, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorClient
import os
import razorpay
import logging
from datetime import datetime
from uuid import uuid4

from models import DonationCreate

router = APIRouter(prefix="/donations", tags=["Donations"])

# ================== Logging ==================
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("donations")

# ================== Environment Variables ==================
MONGO_URL = os.getenv("MONGO_URL")
DB_NAME = os.getenv("DB_NAME", "rids_ngo")

RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET")

if not MONGO_URL:
    raise RuntimeError("❌ MONGO_URL not set")

if not RAZORPAY_KEY_ID or not RAZORPAY_KEY_SECRET:
    raise RuntimeError("❌ Razorpay keys not set")

# ================== Database (Singleton) ==================
mongo_client = AsyncIOMotorClient(MONGO_URL)
db = mongo_client[DB_NAME]

# ================== Razorpay Client ==================
razorpay_client = razorpay.Client(
    auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET)
)

# ================== Routes ==================

@router.post("/create-order", status_code=status.HTTP_201_CREATED)
async def create_razorpay_order(donation: DonationCreate):
    """
    Create Razorpay order and store donation in DB
    """

    donation_id = str(uuid4())

    donation_doc = {
        "id": donation_id,
        "name": donation.name,
        "email": donation.email,
        "phone": donation.phone,
        "amount": donation.amount,
        "type": donation.type,
        "status": "pending",
        "created_at": datetime.utcnow(),
    }

    try:
        # Save donation first
        await db.donations.insert_one(donation_doc)
        logger.info(f"Donation created: {donation_id}")

        # Create Razorpay order (amount in paise)
        amount_paise = int(donation.amount * 100)

        razorpay_order = razorpay_client.order.create({
            "amount": amount_paise,
            "currency": "INR",
            "receipt": donation_id,
            "payment_capture": 1,
            "notes": {
                "donation_id": donation_id,
                "donor_name": donation.name,
                "donor_email": donation.email,
                "donor_phone": donation.phone,
                "donation_type": donation.type,
            }
        })

        # Update donation with Razorpay order ID
        await db.donations.update_one(
            {"id": donation_id},
            {"$set": {"razorpay_order_id": razorpay_order["id"]}}
        )

        return {
            "status": "created",
            "order_id": razorpay_order["id"],
            "donation_id": donation_id,
            "amount": donation.amount,
            "amount_paise": razorpay_order["amount"],
            "currency": razorpay_order["currency"],
            "razorpay_key_id": RAZORPAY_KEY_ID,
            "donor": {
                "name": donation.name,
                "email": donation.email,
                "phone": donation.phone,
            }
        }

    except Exception as e:
        logger.exception("Razorpay order creation failed")

        await db.donations.update_one(
            {"id": donation_id},
            {"$set": {"status": "failed", "error": str(e)}}
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create Razorpay order"
        )
