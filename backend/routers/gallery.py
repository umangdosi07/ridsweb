from fastapi import APIRouter, HTTPException, status, Depends
from motor.motor_asyncio import AsyncIOMotorClient
from typing import List
import os

from models import GalleryImage, GalleryCreate
from auth import get_current_user

router = APIRouter(prefix="/gallery", tags=["Gallery"])

# Database connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'rids_ngo')]

@router.get("", response_model=List[GalleryImage])
async def get_gallery(category: str = None, limit: int = 50):
    """Get all gallery images with optional filtering."""
    query = {}
    if category:
        query["category"] = category
    
    images = await db.gallery.find(query).sort("created_at", -1).to_list(limit)
    return [GalleryImage(**image) for image in images]

@router.post("", response_model=GalleryImage)
async def add_image(image: GalleryCreate, current_user: dict = Depends(get_current_user)):
    """Add a new image to gallery (admin only)."""
    image_obj = GalleryImage(**image.dict())
    image_dict = image_obj.dict()
    
    await db.gallery.insert_one(image_dict)
    return image_obj

@router.post("/bulk", response_model=List[GalleryImage])
async def add_images_bulk(images: List[GalleryCreate], current_user: dict = Depends(get_current_user)):
    """Add multiple images to gallery (admin only)."""
    image_objs = [GalleryImage(**img.dict()) for img in images]
    image_dicts = [img.dict() for img in image_objs]
    
    await db.gallery.insert_many(image_dicts)
    return image_objs

@router.delete("/{image_id}")
async def delete_image(image_id: str, current_user: dict = Depends(get_current_user)):
    """Delete an image from gallery (admin only)."""
    result = await db.gallery.delete_one({"id": image_id})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Image not found"
        )
    return {"message": "Image deleted successfully"}
