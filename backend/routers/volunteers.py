from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Optional
from datetime import datetime
from uuid import uuid4
import os

from motor.motor_asyncio import AsyncIOMotorClient

from models import Volunteer, VolunteerCreate, VolunteerUpdate
from auth import get_current_user

# ======================================================
# ROUTER
# ======================================================
router = APIRouter(
    prefix="/volunteers",
    tags=["Volunteer Applications"]
)

# ======================================================
# DATABASE
# ======================================================
MONGO_URL = os.getenv("MONGO_URL")
DB_NAME = os.getenv("DB_NAME", "rids_ngo")

if not MONGO_URL:
    raise RuntimeError("MONGO_URL is not set")

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

# ======================================================
# HEALTH CHECK
# ======================================================
@router.get("/health")
def volunteers_health():
    return {"status": "volunteers router alive"}

# ======================================================
# CREATE VOLUNTEER (PUBLIC – FORM)
# ======================================================
@router.post("", response_model=Volunteer, status_code=status.HTTP_201_CREATED)
async def create_volunteer(volunteer: VolunteerCreate):
    volunteer_doc = {
        "id": str(uuid4()),
        "name": volunteer.name,
        "email": volunteer.email,
        "phone": volunteer.phone,
        "city": volunteer.city,
        "interest": volunteer.interest,
        "availability": volunteer.availability,
        "experience": volunteer.experience,
        "message": volunteer.message,
        "status": "new",
        "created_at": datetime.utcnow(),
    }

    await db.volunteers.insert_one(volunteer_doc)

    volunteer_doc.pop("_id", None)
    return Volunteer(**volunteer_doc)

# ======================================================
# GET ALL VOLUNTEERS (ADMIN ONLY)
# ======================================================
@router.get("", response_model=List[Volunteer])
async def get_volunteers(
    status_filter: Optional[str] = None,
    limit: int = 100,
    current_user: dict = Depends(get_current_user)
):
    query = {}
    if status_filter:
        query["status"] = status_filter

    volunteers = (
        await db.volunteers
        .find(query)
        .sort("created_at", -1)
        .to_list(limit)
    )

    for v in volunteers:
        v.pop("_id", None)

    return [Volunteer(**v) for v in volunteers]

# ======================================================
# UPDATE VOLUNTEER STATUS (ADMIN ONLY)
# ======================================================
@router.put("/{volunteer_id}", response_model=Volunteer)
async def update_volunteer_status(
    volunteer_id: str,
    volunteer_update: VolunteerUpdate,
    current_user: dict = Depends(get_current_user)
):
    valid_statuses = ["new", "contacted", "accepted", "rejected"]
    if volunteer_update.status not in valid_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Status must be one of {valid_statuses}"
        )

    result = await db.volunteers.update_one(
        {"id": volunteer_id},
        {"$set": {"status": volunteer_update.status}}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Volunteer not found")

    updated = await db.volunteers.find_one({"id": volunteer_id})
    updated.pop("_id", None)
    return Volunteer(**updated)

# ======================================================
# DELETE VOLUNTEER (ADMIN ONLY)
# ======================================================
@router.delete("/{volunteer_id}")
async def delete_volunteer(
    volunteer_id: str,
    current_user: dict = Depends(get_current_user)
):
    result = await db.volunteers.delete_one({"id": volunteer_id})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Volunteer not found")

    return {"message": "Volunteer deleted successfully"}
