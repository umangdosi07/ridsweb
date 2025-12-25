from fastapi import APIRouter, HTTPException, status, Depends
from motor.motor_asyncio import AsyncIOMotorClient
from typing import List
import os

from models import News, NewsCreate, NewsUpdate
from auth import get_current_user

router = APIRouter(prefix="/news", tags=["News"])

# Database connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'rids_ngo')]

@router.get("", response_model=List[News])
async def get_news(status: str = None, category: str = None, limit: int = 20):
    """Get all news articles with optional filtering."""
    query = {}
    if status:
        query["status"] = status
    if category:
        query["category"] = category
    
    news = await db.news.find(query).sort("date", -1).to_list(limit)
    return [News(**article) for article in news]

@router.get("/{news_id}", response_model=News)
async def get_news_article(news_id: str):
    """Get a single news article by ID."""
    article = await db.news.find_one({"id": news_id})
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found"
        )
    return News(**article)

@router.post("", response_model=News)
async def create_news(news: NewsCreate, current_user: dict = Depends(get_current_user)):
    """Create a new news article (admin only)."""
    news_obj = News(**news.dict())
    news_dict = news_obj.dict()
    
    await db.news.insert_one(news_dict)
    return news_obj

@router.put("/{news_id}", response_model=News)
async def update_news(
    news_id: str, 
    news_update: NewsUpdate, 
    current_user: dict = Depends(get_current_user)
):
    """Update a news article (admin only)."""
    existing = await db.news.find_one({"id": news_id})
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found"
        )
    
    update_data = {k: v for k, v in news_update.dict().items() if v is not None}
    
    await db.news.update_one(
        {"id": news_id},
        {"$set": update_data}
    )
    
    updated = await db.news.find_one({"id": news_id})
    return News(**updated)

@router.delete("/{news_id}")
async def delete_news(news_id: str, current_user: dict = Depends(get_current_user)):
    """Delete a news article (admin only)."""
    result = await db.news.delete_one({"id": news_id})
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found"
        )
    return {"message": "Article deleted successfully"}
