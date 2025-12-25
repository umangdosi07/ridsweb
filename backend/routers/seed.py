from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorClient
import os
from typing import List

from models import (
    Program, News, Story, GalleryImage,
    ProgramCreate, NewsCreate, StoryCreate, GalleryCreate
)
from auth import get_current_user

router = APIRouter(prefix="/seed", tags=["Database Seeding"])

# Database connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'rids_ngo')]

# Seed data
SEED_PROGRAMS = [
    {
        "title": "Shakti Self-Help Groups",
        "category": "Women Empowerment",
        "description": "Forming and nurturing women's self-help groups for financial independence and community leadership.",
        "beneficiaries": 5000,
        "image": "https://images.unsplash.com/photo-1759738098462-90ffac98c554?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwzfHxydXJhbCUyMEluZGlhJTIwY29tbXVuaXR5fGVufDB8fHx8MTc2NTA1NjU5M3ww&ixlib=rb-4.1.0&q=85"
    },
    {
        "title": "Bal Vikas Kendra",
        "category": "Child Development",
        "description": "Community-based childcare centers providing early childhood education and nutrition support.",
        "beneficiaries": 3500,
        "image": "https://images.unsplash.com/photo-1600792174277-8d734290a61f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwxfHx0cmliYWwlMjBjaGlsZHJlbiUyMGVkdWNhdGlvbnxlbnwwfHx8fDE3NjUwNTY2MDR8MA&ixlib=rb-4.1.0&q=85"
    },
    {
        "title": "Mobile Health Clinics",
        "category": "Healthcare",
        "description": "Bringing healthcare to doorsteps with mobile medical units in remote tribal areas.",
        "beneficiaries": 12000,
        "image": "https://images.unsplash.com/photo-1742106850780-fbcc50b1ef5f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwcnVyYWwlMjB2aWxsYWdlfGVufDB8fHx8MTc2NTA1NjYxMHww&ixlib=rb-4.1.0&q=85"
    },
    {
        "title": "Tribal Livelihood Program",
        "category": "Tribal Upliftment",
        "description": "Sustainable livelihood initiatives including agriculture training and handicraft development.",
        "beneficiaries": 8000,
        "image": "https://images.unsplash.com/photo-1641810290430-c24d021d4ace?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHw0fHx3b21lbiUyMGVtcG93ZXJtZW50JTIwSW5kaWF8ZW58MHx8fHwxNzY1MDU2NTk5fDA&ixlib=rb-4.1.0&q=85"
    },
    {
        "title": "Vidya Scholarship Program",
        "category": "Education",
        "description": "Supporting meritorious students from underprivileged families with scholarships and mentorship.",
        "beneficiaries": 2500,
        "image": "https://images.pexels.com/photos/4314674/pexels-photo-4314674.jpeg"
    },
    {
        "title": "Yuva Kaushal Vikas",
        "category": "Youth Empowerment",
        "description": "Vocational training and skill development programs for unemployed youth.",
        "beneficiaries": 4000,
        "image": "https://images.pexels.com/photos/19957638/pexels-photo-19957638.jpeg"
    }
]

SEED_NEWS = [
    {
        "title": "RIDS Launches New Skill Development Center in Banswara",
        "excerpt": "A new vocational training center inaugurated to provide employment opportunities for rural youth.",
        "content": "RIDS has inaugurated a state-of-the-art skill development center in Banswara district, aimed at providing vocational training to rural youth. The center offers courses in tailoring, computer literacy, electrical work, and handicrafts.",
        "category": "Announcement",
        "image": "https://images.pexels.com/photos/19957638/pexels-photo-19957638.jpeg"
    },
    {
        "title": "500 Women Complete Entrepreneurship Training",
        "excerpt": "Another batch of women graduates from our Shakti program, ready to start their own businesses.",
        "content": "In a remarkable achievement, 500 women from tribal communities have successfully completed our entrepreneurship training program. These women are now equipped with skills to start their own micro-enterprises.",
        "category": "Success",
        "image": "https://images.unsplash.com/photo-1724737419548-1e733c69efd5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwzfHx3b21lbiUyMGVtcG93ZXJtZW50JTIwSW5kaWF8ZW58MHx8fHwxNzY1MDU2NTk5fDA&ixlib=rb-4.1.0&q=85"
    },
    {
        "title": "Health Camp Reaches 2000 Beneficiaries",
        "excerpt": "Our quarterly health camp provided free medical checkups and medicines to tribal communities.",
        "content": "The quarterly health camp organized by RIDS reached over 2000 beneficiaries across 15 villages. Free medical checkups, medicines, and health awareness sessions were provided.",
        "category": "Event",
        "image": "https://images.unsplash.com/photo-1742106850780-fbcc50b1ef5f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwcnVyYWwlMjB2aWxsYWdlfGVufDB8fHx8MTc2NTA1NjYxMHww&ixlib=rb-4.1.0&q=85"
    }
]

SEED_STORIES = [
    {
        "name": "Kamla Devi",
        "location": "Kushalgarh Village",
        "story": "From a daily wage laborer to the proud owner of a tailoring business. RIDS' skill training program changed my life and now I employ three other women from my village.",
        "image": "https://images.unsplash.com/photo-1724737419548-1e733c69efd5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwzfHx3b21lbiUyMGVtcG93ZXJtZW50JTIwSW5kaWF8ZW58MHx8fHwxNzY1MDU2NTk5fDA&ixlib=rb-4.1.0&q=85",
        "program": "Women Empowerment"
    },
    {
        "name": "Raju Meena",
        "location": "Sajjangarh",
        "story": "I was the first in my family to go to school, thanks to RIDS scholarship. Today I am a school teacher, inspiring the next generation of tribal children.",
        "image": "https://images.pexels.com/photos/4314674/pexels-photo-4314674.jpeg",
        "program": "Education"
    },
    {
        "name": "Geeta Bai",
        "location": "Banswara",
        "story": "The mobile health clinic saved my newborn's life. Now I volunteer to spread awareness about maternal health in my community.",
        "image": "https://images.unsplash.com/photo-1641810290430-c24d021d4ace?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHw0fHx3b21lbiUyMGVtcG93ZXJtZW50JTIwSW5kaWF8ZW58MHx8fHwxNzY1MDU2NTk5fDA&ixlib=rb-4.1.0&q=85",
        "program": "Healthcare"
    }
]

SEED_GALLERY = [
    {"url": "https://images.unsplash.com/photo-1601689892697-b64daa00ff6d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwxfHxydXJhbCUyMEluZGlhJTIwY29tbXVuaXR5fGVufDB8fHx8MTc2NTA1NjU5M3ww&ixlib=rb-4.1.0&q=85", "category": "Community", "title": "Village gathering"},
    {"url": "https://images.unsplash.com/photo-1759738098462-90ffac98c554?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwzfHxydXJhbCUyMEluZGlhJTIwY29tbXVuaXR5fGVufDB8fHx8MTc2NTA1NjU5M3ww&ixlib=rb-4.1.0&q=85", "category": "Women", "title": "Women at work"},
    {"url": "https://images.unsplash.com/photo-1724737419548-1e733c69efd5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwzfHx3b21lbiUyMGVtcG93ZXJtZW50JTIwSW5kaWF8ZW58MHx8fHwxNzY1MDU2NTk5fDA&ixlib=rb-4.1.0&q=85", "category": "Women", "title": "Empowerment program"},
    {"url": "https://images.unsplash.com/photo-1600792174277-8d734290a61f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwxfHx0cmliYWwlMjBjaGlsZHJlbiUyMGVkdWNhdGlvbnxlbnwwfHx8fDE3NjUwNTY2MDR8MA&ixlib=rb-4.1.0&q=85", "category": "Education", "title": "School children"},
    {"url": "https://images.unsplash.com/photo-1763809677372-3064c11c29f0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHw0fHx0cmliYWwlMjBjaGlsZHJlbiUyMGVkdWNhdGlvbnxlbnwwfHx8fDE3NjUwNTY2MDR8MA&ixlib=rb-4.1.0&q=85", "category": "Tribal", "title": "Tribal community"},
    {"url": "https://images.unsplash.com/photo-1742106850780-fbcc50b1ef5f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwcnVyYWwlMjB2aWxsYWdlfGVufDB8fHx8MTc2NTA1NjYxMHww&ixlib=rb-4.1.0&q=85", "category": "Healthcare", "title": "Health camp"},
    {"url": "https://images.unsplash.com/photo-1689428615940-64d549e2231c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwyfHxoZWFsdGhjYXJlJTIwcnVyYWwlMjB2aWxsYWdlfGVufDB8fHx8MTc2NTA1NjYxMHww&ixlib=rb-4.1.0&q=85", "category": "Community", "title": "Village view"},
    {"url": "https://images.pexels.com/photos/4314674/pexels-photo-4314674.jpeg", "category": "Education", "title": "Learning together"}
]

@router.post("/all")
async def seed_all_data(current_user: dict = Depends(get_current_user)):
    """Seed all initial data (admin only). Use with caution."""
    results = {}
    
    # Seed programs
    existing_programs = await db.programs.count_documents({})
    if existing_programs == 0:
        program_objs = [Program(**p) for p in SEED_PROGRAMS]
        await db.programs.insert_many([p.dict() for p in program_objs])
        results["programs"] = len(SEED_PROGRAMS)
    else:
        results["programs"] = f"Skipped ({existing_programs} already exist)"
    
    # Seed news
    existing_news = await db.news.count_documents({})
    if existing_news == 0:
        news_objs = [News(**n) for n in SEED_NEWS]
        await db.news.insert_many([n.dict() for n in news_objs])
        results["news"] = len(SEED_NEWS)
    else:
        results["news"] = f"Skipped ({existing_news} already exist)"
    
    # Seed stories
    existing_stories = await db.stories.count_documents({})
    if existing_stories == 0:
        story_objs = [Story(**s) for s in SEED_STORIES]
        await db.stories.insert_many([s.dict() for s in story_objs])
        results["stories"] = len(SEED_STORIES)
    else:
        results["stories"] = f"Skipped ({existing_stories} already exist)"
    
    # Seed gallery
    existing_gallery = await db.gallery.count_documents({})
    if existing_gallery == 0:
        gallery_objs = [GalleryImage(**g) for g in SEED_GALLERY]
        await db.gallery.insert_many([g.dict() for g in gallery_objs])
        results["gallery"] = len(SEED_GALLERY)
    else:
        results["gallery"] = f"Skipped ({existing_gallery} already exist)"
    
    return {"message": "Database seeded", "results": results}
