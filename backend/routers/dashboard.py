from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import datetime, timedelta

from auth import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

# Database connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'rids_ngo')]

@router.get("/stats")
async def get_dashboard_stats(current_user: dict = Depends(get_current_user)):
    """Get comprehensive dashboard statistics (admin only)."""
    
    # Donation stats
    donation_pipeline = [
        {"$match": {"status": "completed"}},
        {"$group": {"_id": None, "total": {"$sum": "$amount"}, "count": {"$sum": 1}}}
    ]
    donation_result = await db.donations.aggregate(donation_pipeline).to_list(1)
    
    # Count stats
    stats = {
        "donations": {
            "total_amount": donation_result[0]["total"] if donation_result else 0,
            "total_count": donation_result[0]["count"] if donation_result else 0,
            "monthly_donors": await db.donations.count_documents({"type": "monthly", "status": "completed"})
        },
        "volunteers": {
            "total": await db.volunteers.count_documents({}),
            "new": await db.volunteers.count_documents({"status": "new"}),
            "accepted": await db.volunteers.count_documents({"status": "accepted"})
        },
        "inquiries": {
            "total": await db.inquiries.count_documents({}),
            "new": await db.inquiries.count_documents({"status": "new"})
        },
        "programs": {
            "total": await db.programs.count_documents({}),
            "active": await db.programs.count_documents({"status": "active"})
        },
        "stories": await db.stories.count_documents({}),
        "news": await db.news.count_documents({}),
        "gallery": await db.gallery.count_documents({}),
        "newsletter": {
            "total": await db.newsletter.count_documents({}),
            "active": await db.newsletter.count_documents({"status": "active"})
        }
    }
    
    return stats

@router.get("/recent")
async def get_recent_activity(current_user: dict = Depends(get_current_user)):
    """Get recent activity across all modules (admin only)."""
    
    # Recent donations
    recent_donations = await db.donations.find().sort("created_at", -1).to_list(5)
    
    # Recent inquiries
    recent_inquiries = await db.inquiries.find().sort("created_at", -1).to_list(5)
    
    # Recent volunteers
    recent_volunteers = await db.volunteers.find().sort("created_at", -1).to_list(5)
    
    # Recent newsletter subscriptions
    recent_subscribers = await db.newsletter.find().sort("subscribed_at", -1).to_list(5)
    
    return {
        "donations": [
            {
                "id": d.get("id"),
                "name": d.get("name"),
                "amount": d.get("amount"),
                "status": d.get("status"),
                "created_at": d.get("created_at")
            } for d in recent_donations
        ],
        "inquiries": [
            {
                "id": i.get("id"),
                "name": i.get("name"),
                "subject": i.get("subject"),
                "status": i.get("status"),
                "created_at": i.get("created_at")
            } for i in recent_inquiries
        ],
        "volunteers": [
            {
                "id": v.get("id"),
                "name": v.get("name"),
                "interest": v.get("interest"),
                "status": v.get("status"),
                "created_at": v.get("created_at")
            } for v in recent_volunteers
        ],
        "subscribers": [
            {
                "id": s.get("id"),
                "email": s.get("email"),
                "subscribed_at": s.get("subscribed_at")
            } for s in recent_subscribers
        ]
    }
