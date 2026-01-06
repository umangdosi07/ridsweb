from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

# Import routers
from donations import router as donations_router
# Add other routers if needed:
# from auth import router as auth_router
# from programs import router as programs_router

app = FastAPI(title="RIDS Web Backend")

# CORS configuration
FRONTEND_URL = os.getenv("FRONTEND_URL")  # Must match your frontend deployment URL

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL] if FRONTEND_URL else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint
@app.get("/")
def read_root():
    return {"message": "Hello from backend!"}

# Include routers with "/api" prefix
app.include_router(donations_router, prefix="/api")
# app.include_router(auth_router, prefix="/api")
# app.include_router(programs_router, prefix="/api")

