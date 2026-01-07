from fastapi import APIRouter
from typing import Optional

from db import get_db

router = APIRouter(prefix="/programs", tags=["Programs"])

# ============================
# HEALTH CHECK
# ============================

@router.get("/health")
async def programs_health():
    return {"status": "programs router alive"}

# ============================
# LIST PROGRAMS (SAFE VERSION)
# ============================

@router.get("")
async def get_programs(
    status: Optional[str] = None,
    category: Optional[str] = None
):
    db = get_db()

    query = {}
    if status:
        query["status"] = status
    if category:
        query["category"] = category

    programs = await (
        db.programs
        .find(query)
        .sort("created_at", -1)
        .to_list(100)
    )

    # Return raw MongoDB documents (TEMP, SAFE)
    return programs
