from fastapi import APIRouter
from typing import Optional

from db import get_db

# ✅ ROUTER MUST BE DEFINED FIRST
router = APIRouter(prefix="/programs", tags=["Programs"])

# ----------------------------
# HEALTH CHECK (NO DB)
# ----------------------------
@router.get("/health")
async def programs_health():
    return {"status": "programs router alive"}

# ----------------------------
# MONGO CONNECTION TEST
# ----------------------------
@router.get("/mongo-test")
async def mongo_test():
    db = get_db()
    await db.command("ping")
    return {"mongo": "connected"}

# ----------------------------
# LIST PROGRAMS
# ----------------------------
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

    return programs
