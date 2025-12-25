from fastapi import APIRouter, HTTPException, status, Depends
from motor.motor_asyncio import AsyncIOMotorClient
from typing import List
import os

from models import Story, StoryCreate, StoryUpdate
from auth import get_current_user

router = APIRouter(prefix="/stories", tags=["Impact Stories"])

# Database connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'rids_ngo')]

@router.get("", response_model=List[Story])
async def get_stories(program: str = None, limit: int = 20):
    """Get all impact stories with optional filtering."""
    query = {}
    if program:
        query["program"] = program
    
    stories = await db.stories.find(query).sort("created_at", -1).to_list(limit)
    return [Story(**story) for story in stories]

@router.get("/{story_id}", response_model=Story)
async def get_story(story_id: str):
    """Get a single story by ID."""
    story = await db.stories.find_one({"id": story_id})
    if not story:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Story not found"
        )
    return Story(**story)

@router.post("", response_model=Story)
async def create_story(story: StoryCreate, current_user: dict = Depends(get_current_user)):
    """Create a new impact story (admin only)."""
    story_obj = Story(**story.dict())
    story_dict = story_obj.dict()
    
    await db.stories.insert_one(story_dict)
    return story_obj

@router.put("/{story_id}", response_model=Story)
async def update_story(
    story_id: str, 
    story_update: StoryUpdate, 
    current_user: dict = Depends(get_current_user)
):
    """Update an impact story (admin only)."""
    existing = await db.stories.find_one({"id": story_id})
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Story not found"
        )
    
    update_data = {k: v for k, v in story_update.dict().items() if v is not None}
    
    await db.stories.update_one(
        {"id": story_id},
        {"$set": update_data}
    )
    
    updated = await db.stories.find_one({"id": story_id})
    return Story(**updated)

@router.delete("/{story_id}")
async def delete_story(story_id: str, current_user: dict = Depends(get_current_user)):
    """Delete an impact story (admin only)."""
    result = await db.stories.delete_one({"id": story_id})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Story not found"
        )
    return {"message": "Story deleted successfully"}
