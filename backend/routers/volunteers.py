from fastapi import APIRouter, HTTPException, status, Depends
from motor.motor_asyncio import AsyncIOMotorClient
from typing import List
import os

from models import Volunteer, VolunteerCreate, VolunteerUpdate
from auth import get_current_user

router = APIRouter(prefix="/volunteers", tags=["Volunteer Applications"])

# Database connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'rids_ngo')]

@router.get("", response_model=List[Volunteer])
async def get_volunteers(
    status_filter: str = None,
    limit: int = 100,
    current_user: dict = Depends(get_current_user)
):
    """Get all volunteer applications (admin only)."""
    query = {}
    if status_filter:
        query["status"] = status_filter
    
    volunteers = await db.volunteers.find(query).sort("created_at", -1).to_list(limit)
    return [Volunteer(**volunteer) for volunteer in volunteers]

@router.get("/stats")
async def get_volunteer_stats(current_user: dict = Depends(get_current_user)):
    """Get volunteer application statistics (admin only)."""
    total = await db.volunteers.count_documents({})
    new_count = await db.volunteers.count_documents({"status": "new"})
    accepted_count = await db.volunteers.count_documents({"status": "accepted"})
    
    return {
        "total": total,
        "new": new_count,
        "accepted": accepted_count,
        "contacted": await db.volunteers.count_documents({"status": "contacted"}),
        "rejected": await db.volunteers.count_documents({"status": "rejected"})
    }

@router.post("", response_model=Volunteer)
async def create_volunteer_application(volunteer: VolunteerCreate):
    """Submit a volunteer application."""
    volunteer_obj = Volunteer(**volunteer.dict())
    volunteer_dict = volunteer_obj.dict()
    
    await db.volunteers.insert_one(volunteer_dict)
    return volunteer_obj

@router.put("/{volunteer_id}", response_model=Volunteer)
async def update_volunteer_status(
    volunteer_id: str,
    volunteer_update: VolunteerUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update volunteer application status (admin only)."""
    valid_statuses = ["new", "contacted", "accepted", "rejected"]
    if volunteer_update.status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status. Must be one of: {valid_statuses}"
        )
    
    result = await db.volunteers.update_one(
        {"id": volunteer_id},
        {"$set": {"status": volunteer_update.status}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Volunteer application not found"
        )
    
    updated = await db.volunteers.find_one({"id": volunteer_id})
    return Volunteer(**updated)

@router.delete("/{volunteer_id}")
async def delete_volunteer(volunteer_id: str, current_user: dict = Depends(get_current_user)):
    """Delete a volunteer application (admin only)."""
    result = await db.volunteers.delete_one({"id": volunteer_id})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Volunteer application not found"
        )
    return {"message": "Volunteer application deleted successfully"}
