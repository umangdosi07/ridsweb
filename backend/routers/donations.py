from fastapi import APIRouter, HTTPException, status, BackgroundTasks, Depends
import os
import razorpay
import logging
from datetime import datetime
from uuid import uuid4

from models import DonationCreate
from db import get_db
from auth import get_current_user
from utils.email import send_email

router = APIRouter(prefix="/donations", tags=["Donations"])

logger = logging.getLogger("donations")
logger.setLevel(logging.INFO)


@router.get("/health")
async def health_check():
    return {"status": "donations router OK"}


# ================================
# CREATE DONATION + EMAIL
# ================================
@router.post("/create-order", status_code=status.HTTP_201_CREATED)
async def create_razorpay_order(
    donation: DonationCreate,
    background_tasks: BackgroundTasks
):
    RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID")
    RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET")

    if not RAZORPAY_KEY_ID or not RAZORPAY_KEY_SECRET:
        raise HTTPException(status_code=503, detail="Payment gateway not configured")

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
        await db.donations.insert_one(donation_doc)

        order = razorpay_client.order.create({
            "amount": int(donation.amount * 100),
            "currency": "INR",
            "receipt": donation_id,
            "payment_capture": 1,
        })

        await db.donations.update_one(
            {"id": donation_id},
            {"$set": {"razorpay_order_id": order["id"]}}
        )

        # ================= EMAILS =================
        background_tasks.add_task(
            send_email,
            donation.email,
            "Thank you for supporting RIDS ❤️",
            f"""
Dear {donation.name},

Thank you for your generous donation of ₹{donation.amount}.
Your support helps us serve communities in need.

Donation ID: {donation_id}

— RIDS Team
"""
        )

        background_tasks.add_task(
            send_email,
            os.getenv("RIDS_OFFICIAL_EMAIL"),
            "New Donation Received",
            f"""
New donation received:

Name: {donation.name}
Email: {donation.email}
Phone: {donation.phone}
Amount: ₹{donation.amount}
Type: {donation.type}
Donation ID: {donation_id}
"""
        )

        return {
            "order_id": order["id"],
            "donation_id": donation_id,
            "razorpay_key_id": RAZORPAY_KEY_ID,
        }

    except Exception as e:
        logger.exception("Donation failed")
        raise HTTPException(status_code=500, detail="Donation failed")


# ================================
# GET DONATIONS (ADMIN)
# ================================
@router.get("", dependencies=[Depends(get_current_user)])
async def get_donations():
    db = get_db()
    donations = await db.donations.find({}).sort("created_at", -1).to_list(1000)

    for d in donations:
        d.pop("_id", None)

    return donations
