# backend/routers/donations.py

from fastapi import APIRouter, HTTPException, status, Depends
import os
import razorpay
import logging
from datetime import datetime
from uuid import uuid4
from typing import List, Optional

from models import Donation, DonationCreate
from auth import get_current_user
from db import get_db   # ✅ safe lazy DB loader

router = APIRouter(prefix="/donations", tags=["Donations"])

# ================== Logging ==================
logger = logging.getLogger("donations")
logger.setLevel(logging.INFO)

# ================== HEALTH ==================

@router.get("/health")
async def health_check():
    return {"status": "donations router OK"}

# ======================================================
# CREATE RAZORPAY ORDER (PUBLIC)
# ======================================================
@router.post("/create-order", status_code=status.HTTP_201_CREATED)
async def create_razorpay_order(donation: DonationCreate):
    """
    Create Razorpay order and store donation in DB
    """

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
        # Save donation first
        await db.donations.insert_one(donation_doc)
        logger.info(f"Donation created: {donation_id}")

        # Razorpay expects paise
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

# ======================================================
# GET ALL DONATIONS (ADMIN ONLY)
# ======================================================
@router.get("", response_model=List[Donation])
async def get_donations(
    status_filter: Optional[str] = None,
    limit: int = 100,
    current_user: dict = Depends(get_current_user),
):
    db = get_db()

    query = {}
    if status_filter:
        query["status"] = status_filter

    donations = (
        await db.donations
        .find(query)
        .sort("created_at", -1)
        .to_list(limit)
    )

    for d in donations:
        d.pop("_id", None)

    return [Donation(**d) for d in donations]

# ======================================================
# UPDATE DONATION STATUS (ADMIN)
# ======================================================
@router.put("/{donation_id}/status")
async def update_donation_status(
    donation_id: str,
    status: str,
    current_user: dict = Depends(get_current_user),
):
    valid_statuses = ["pending", "completed", "failed"]
    if status not in valid_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Status must be one of {valid_statuses}",
        )

    db = get_db()

    result = await db.donations.update_one(
        {"id": donation_id},
        {"$set": {"status": status}},
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Donation not found")

    return {"message": "Donation status updated"}
