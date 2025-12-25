from fastapi import APIRouter, HTTPException, status, Depends
from motor.motor_asyncio import AsyncIOMotorClient
from typing import List
import os

from models import Newsletter, NewsletterCreate
from auth import get_current_user

router = APIRouter(prefix="/newsletter", tags=["Newsletter"])

# Database connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'rids_ngo')]

@router.get("", response_model=List[Newsletter])
async def get_subscribers(
    status_filter: str = None,
    limit: int = 500,
    current_user: dict = Depends(get_current_user)
):
    """Get all newsletter subscribers (admin only)."""
    query = {}
    if status_filter:
        query["status"] = status_filter
    
    subscribers = await db.newsletter.find(query).sort("subscribed_at", -1).to_list(limit)
    return [Newsletter(**sub) for sub in subscribers]

@router.get("/stats")
async def get_newsletter_stats(current_user: dict = Depends(get_current_user)):
    """Get newsletter statistics (admin only)."""
    total = await db.newsletter.count_documents({})
    active = await db.newsletter.count_documents({"status": "active"})
    
    return {
        "total": total,
        "active": active,
        "unsubscribed": total - active
    }

@router.post("", response_model=Newsletter)
async def subscribe(subscription: NewsletterCreate):
    """Subscribe to newsletter."""
    # Check if already subscribed
    existing = await db.newsletter.find_one({"email": subscription.email})
    if existing:
        if existing["status"] == "active":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already subscribed"
            )
        else:
            # Reactivate subscription
            await db.newsletter.update_one(
                {"email": subscription.email},
                {"$set": {"status": "active"}}
            )
            updated = await db.newsletter.find_one({"email": subscription.email})
            return Newsletter(**updated)
    
    newsletter_obj = Newsletter(**subscription.dict())
    newsletter_dict = newsletter_obj.dict()
    
    await db.newsletter.insert_one(newsletter_dict)
    return newsletter_obj

@router.delete("/{subscriber_id}")
async def unsubscribe(subscriber_id: str, current_user: dict = Depends(get_current_user)):
    """Unsubscribe/remove from newsletter (admin only)."""
    result = await db.newsletter.update_one(
        {"id": subscriber_id},
        {"$set": {"status": "unsubscribed"}}
    )
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Subscriber not found"
        )
    return {"message": "Unsubscribed successfully"}

@router.post("/unsubscribe")
async def unsubscribe_by_email(email: str):
    """Unsubscribe by email (public endpoint)."""
    result = await db.newsletter.update_one(
        {"email": email},
        {"$set": {"status": "unsubscribed"}}
    )
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Email not found in subscriber list"
        )
    return {"message": "Unsubscribed successfully"}
