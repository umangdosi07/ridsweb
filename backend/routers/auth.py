from fastapi import APIRouter, HTTPException, status, Depends
from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import timedelta

from models import AdminUserCreate, AdminUserLogin, AdminUser, Token
from auth import (
    get_password_hash, 
    verify_password, 
    create_access_token, 
    ACCESS_TOKEN_EXPIRE_MINUTES,
    get_current_user
)

router = APIRouter(prefix="/auth", tags=["Authentication"])

# Database connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'rids_ngo')]

@router.post("/register", response_model=AdminUser)
async def register_admin(user: AdminUserCreate, current_user: dict = Depends(get_current_user)):
    """Register a new admin user. Only existing admins can create new admins."""
    # Check if user already exists
    existing_user = await db.admin_users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    user_dict = {
        "email": user.email,
        "name": user.name,
        "hashed_password": get_password_hash(user.password),
        "role": "admin"
    }
    admin_user = AdminUser(**user_dict)
    user_dict["id"] = admin_user.id
    user_dict["created_at"] = admin_user.created_at
    
    await db.admin_users.insert_one(user_dict)
    
    return admin_user

@router.post("/login", response_model=Token)
async def login(credentials: AdminUserLogin):
    """Login and get access token."""
    # Find user
    user = await db.admin_users.find_one({"email": credentials.email})
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verify password
    if not verify_password(credentials.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"], "name": user["name"], "role": user["role"]},
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me")
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Get current user information."""
    user = await db.admin_users.find_one({"email": current_user["email"]})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return {
        "id": user.get("id"),
        "email": user["email"],
        "name": user["name"],
        "role": user["role"]
    }

@router.post("/setup")
async def setup_initial_admin():
    """Create initial admin user if none exists. Only works once."""
    # Check if any admin exists
    admin_count = await db.admin_users.count_documents({})
    if admin_count > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Admin user already exists. Use /login instead."
        )
    
    # Create default admin
    user_dict = {
        "email": "admin@rids.org",
        "name": "Admin",
        "hashed_password": get_password_hash("admin123"),
        "role": "admin"
    }
    admin_user = AdminUser(**user_dict)
    user_dict["id"] = admin_user.id
    user_dict["created_at"] = admin_user.created_at
    
    await db.admin_users.insert_one(user_dict)
    
    return {
        "message": "Initial admin created successfully",
        "email": "admin@rids.org",
        "password": "admin123",
        "note": "Please change the password after first login"
    }

# ======================================================
# TEMPORARY: CREATE FIRST ADMIN (REMOVE AFTER USE)
# ======================================================
from datetime import datetime
from auth import get_password_hash
from db import get_db

@router.post("/_create-admin")
async def _create_admin():
    """
    TEMPORARY endpoint to create first admin user.
    REMOVE AFTER SUCCESSFUL LOGIN.
    """
    db = get_db()

    admin_email = "admin@rids.org"
    admin_password = "admin123"

    existing = await db.users.find_one({"email": admin_email})
    if existing:
        return {"status": "admin already exists"}

    admin_user = {
        "id": "admin-001",
        "name": "Admin",
        "email": admin_email,
        "password": get_password_hash(admin_password),
        "role": "admin",
        "is_active": True,
        "created_at": datetime.utcnow()
    }

    await db.users.insert_one(admin_user)

    return {
        "status": "admin created",
        "email": admin_email,
        "password": admin_password
    }

