from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'rids_ngo')]

# Create the main app
app = FastAPI(
    title="RIDS NGO API",
    description="API for Rajasthan Integrated Development Society NGO Website",
    version="1.0.0"
)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Import routers
from routers.auth import router as auth_router
from routers.programs import router as programs_router
from routers.news import router as news_router
from routers.stories import router as stories_router
from routers.gallery import router as gallery_router
from routers.donations import router as donations_router
from routers.inquiries import router as inquiries_router
from routers.volunteers import router as volunteers_router
from routers.newsletter import router as newsletter_router
from routers.dashboard import router as dashboard_router
from routers.seed import router as seed_router
from routers.users import router as users_router

# Health check endpoint
@api_router.get("/")
async def root():
    return {"message": "RIDS NGO API is running", "status": "healthy"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "database": "connected"}

# Include all routers
api_router.include_router(auth_router)
api_router.include_router(programs_router)
api_router.include_router(news_router)
api_router.include_router(stories_router)
api_router.include_router(gallery_router)
api_router.include_router(donations_router)
api_router.include_router(inquiries_router)
api_router.include_router(volunteers_router)
api_router.include_router(newsletter_router)
api_router.include_router(dashboard_router)
api_router.include_router(seed_router)
api_router.include_router(users_router)

# Include the router in the main app
app.include_router(api_router)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_db_client():
    logger.info("RIDS NGO API started successfully")
    logger.info(f"Database: {os.environ.get('DB_NAME', 'rids_ngo')}")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
    logger.info("Database connection closed")
