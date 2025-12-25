from fastapi import APIRouter, HTTPException, status, Depends
from motor.motor_asyncio import AsyncIOMotorClient
from typing import List
import os
from datetime import datetime

from models import Program, ProgramCreate, ProgramUpdate
from auth import get_current_user

router = APIRouter(prefix="/programs", tags=["Programs"])

# Database connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'rids_ngo')]

@router.get("", response_model=List[Program])
async def get_programs(status: str = None, category: str = None):
    """Get all programs with optional filtering."""
    query = {}
    if status:
        query["status"] = status
    if category:
        query["category"] = category
    
    programs = await db.programs.find(query).sort("created_at", -1).to_list(100)
    return [Program(**program) for program in programs]

@router.get("/{program_id}", response_model=Program)
async def get_program(program_id: str):
    """Get a single program by ID."""
    program = await db.programs.find_one({"id": program_id})
    if not program:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Program not found"
        )
    return Program(**program)

@router.post("", response_model=Program)
async def create_program(program: ProgramCreate, current_user: dict = Depends(get_current_user)):
    """Create a new program (admin only)."""
    program_obj = Program(**program.dict())
    program_dict = program_obj.dict()
    
    await db.programs.insert_one(program_dict)
    return program_obj

@router.put("/{program_id}", response_model=Program)
async def update_program(
    program_id: str, 
    program_update: ProgramUpdate, 
    current_user: dict = Depends(get_current_user)
):
    """Update a program (admin only)."""
    # Check if program exists
    existing = await db.programs.find_one({"id": program_id})
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Program not found"
        )
    
    # Update only provided fields
    update_data = {k: v for k, v in program_update.dict().items() if v is not None}
    update_data["updated_at"] = datetime.utcnow()
    
    await db.programs.update_one(
        {"id": program_id},
        {"$set": update_data}
    )
    
    updated = await db.programs.find_one({"id": program_id})
    return Program(**updated)

@router.delete("/{program_id}")
async def delete_program(program_id: str, current_user: dict = Depends(get_current_user)):
    """Delete a program (admin only)."""
    result = await db.programs.delete_one({"id": program_id})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Program not found"
        )
    return {"message": "Program deleted successfully"}
