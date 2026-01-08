from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Optional
from datetime import datetime

from models import Program, ProgramCreate, ProgramUpdate
from auth import get_current_user
from db import get_db

router = APIRouter(
    prefix="/programs",
    tags=["Programs"]
)

# ======================================================
# HEALTH CHECK (DEBUG & MONITORING)
# ======================================================
@router.get("/health")
async def programs_health():
    return {"status": "programs router alive"}

# ======================================================
# READ PROGRAMS (PUBLIC)
# ======================================================
@router.get("/", response_model=List[Program])
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

    # Remove MongoDB internal field
    for p in programs:
        p.pop("_id", None)

    return [Program(**p) for p in programs]

# ======================================================
# GET SINGLE PROGRAM (PUBLIC)
# ======================================================
@router.get("/{program_id}", response_model=Program)
async def get_program(program_id: str):
    db = get_db()

    program = await db.programs.find_one({"id": program_id})
    if not program:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Program not found"
        )

    program.pop("_id", None)
    return Program(**program)

# ======================================================
# CREATE PROGRAM (ADMIN ONLY)
# ======================================================
@router.post("/", response_model=Program)
async def create_program(
    program: ProgramCreate,
    current_user: dict = Depends(get_current_user)
):
    db = get_db()

    program_obj = Program(**program.dict())
    program_dict = program_obj.dict()
    program_dict["created_at"] = datetime.utcnow()

    await db.programs.insert_one(program_dict)
    return program_obj

# ======================================================
# UPDATE PROGRAM (ADMIN ONLY)
# ======================================================
@router.put("/{program_id}", response_model=Program)
async def update_program(
    program_id: str,
    program_update: ProgramUpdate,
    current_user: dict = Depends(get_current_user)
):
    db = get_db()

    existing = await db.programs.find_one({"id": program_id})
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Program not found"
        )

    update_data = {
        k: v for k, v in program_update.dict().items()
        if v is not None
    }
    update_data["updated_at"] = datetime.utcnow()

    await db.programs.update_one(
        {"id": program_id},
        {"$set": update_data}
    )

    updated = await db.programs.find_one({"id": program_id})
    updated.pop("_id", None)
    return Program(**updated)

# ======================================================
# DELETE PROGRAM (ADMIN ONLY)
# ======================================================
@router.delete("/{program_id}")
async def delete_program(
    program_id: str,
    current_user: dict = Depends(get_current_user)
):
    db = get_db()

    result = await db.programs.delete_one({"id": program_id})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Program not found"
        )

    return {"message": "Program deleted successfully"}
