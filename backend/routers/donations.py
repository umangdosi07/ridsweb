from fastapi import APIRouter, HTTPException, status
import os
import razorpay
import logging
from datetime import datetime
from uuid import uuid4

from models import DonationCreate
from db import get_db
from utils.email import send_donation_emails   # ✅ EMAIL

router = APIRouter(prefix="/donations", tags=["Donations"])

logger = logging.getLogger("donations")
logger.setLevel(logging.INFO)


@router.get("/health")
async def health_check():
    return {"status": "donations router OK"}


@router.get("", status_code=200)
async def get_all_donations():
    """
    Admin: Fetch all donations
    """
    db = get_db()
    donations = await db.donations.find().sort("created_at", -1).to_list(500)

    for d in donations:
        d.pop("_id", None)

    return donations


@router.post("/create-order", status_code=status.HTTP_201_CREATED)
async def create_razorpay_order(donation: DonationCreate):
    RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID")
    RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET")

    if not RAZORPAY_KEY_ID or not RAZORPAY_KEY_SECRET:
        raise HTTPException(
            status_code=503,
            detail="Payment gateway not configured"
        )

    razorpay_client = razorpay.Client(
        auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET)
    )

    db = get_db()
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
        # Save donation
        await db.donations.insert_one(donation_doc)

        # 🔔 SEND EMAILS (DONOR + OFFICIAL)
        send_donation_emails(donation_doc)

        amount_paise = int(donation.amount * 100)

        razorpay_order = razorpay_client.order.create({
            "amount": amount_paise,
            "currency": "INR",
            "receipt": donation_id,
            "payment_capture": 1,
        })

        await db.donations.update_one(
            {"id": donation_id},
            {"$set": {"razorpay_order_id": razorpay_order["id"]}}
        )

        return {
            "status": "created",
            "order_id": razorpay_order["id"],
            "donation_id": donation_id,
            "amount": donation.amount,
            "amount_paise": amount_paise,
            "currency": "INR",
            "razorpay_key_id": RAZORPAY_KEY_ID,
            "donor": {
                "name": donation.name,
                "email": donation.email,
                "phone": donation.phone,
            }
        }

    except Exception as e:
        logger.exception("Donation failed")

        await db.donations.update_one(
            {"id": donation_id},
            {"$set": {"status": "failed", "error": str(e)}}
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to create donation"
        )
