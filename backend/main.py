from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

# Import routers
from donations import router as donations_router
from auth import router as auth_router
from programs import router as programs_router
from news import router as news_router
from gallery import router as gallery_router
from stories import router as stories_router
from inquiries import router as inquiries_router
from volunteers import router as volunteers_router
from newsletter import router as newsletter_router
from users import router as users_router
from dashboard import router as dashboard_router

app = FastAPI(title="RIDS Web Backend")

# =======================
# CORS CONFIGURATION
# =======================
FRONTEND_URL = os.getenv("FRONTEND_URL")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL] if FRONTEND_URL else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =======================
# ROOT ENDPOINT
# =======================
@app.get("/")
def read_root():
    return {"message": "Backend is running 🚀"}

# =======================
# API ROUTERS
# =======================
API_PREFIX = "/api"

app.include_router(auth_router, prefix=API_PREFIX)
app.include_router(users_router, prefix=API_PREFIX)
app.include_router(programs_router, prefix=API_PREFIX)
app.include_router(news_router, prefix=API_PREFIX)
app.include_router(gallery_router, prefix=API_PREFIX)
app.include_router(stories_router, prefix=API_PREFIX)
app.include_router(inquiries_router, prefix=API_PREFIX)
app.include_router(volunteers_router, prefix=API_PREFIX)
app.include_router(newsletter_router, prefix=API_PREFIX)
app.include_router(dashboard_router, prefix=API_PREFIX)

# 🔥 MOST IMPORTANT FOR DONATIONS
app.include_router(donations_router, prefix=API_PREFIX)
