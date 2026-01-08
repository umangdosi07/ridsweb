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

# ======================================================
# DATABASE
# ======================================================
mongo_url = os.environ.get("MONGO_URL")
if not mongo_url:
    raise RuntimeError("MONGO_URL not set")

client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get("DB_NAME", "rids_ngo")]

# ======================================================
# CREATE INITIAL ADMIN (ONE TIME ONLY)
# ======================================================
@router.post("/setup")
async def setup_initial_admin():
    """
    Create initial admin user if none exists.
    This endpoint works ONLY ONCE.
    """
    admin_count = await db.admin_users.count_documents({})
    if admin_count > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Admin already exists. Use /login."
        )

    admin_password = "admin123"

    user_dict = {
        "email": "admin@rids.org",
        "name": "Admin",
        "hashed_password": get_password_hash(admin_password),
        "role": "admin"
    }

    admin_user = AdminUser(**user_dict)
    user_dict["id"] = admin_user.id
    user_dict["created_at"] = admin_user.created_at

    await db.admin_users.insert_one(user_dict)

    return {
        "message": "Initial admin created successfully",
        "email": "admin@rids.org",
        "password": admin_password,
        "note": "Change password after first login"
    }

# ======================================================
# ADMIN LOGIN
# ======================================================
@router.post("/login", response_model=Token)
async def login(credentials: AdminUserLogin):
    """
    Admin login using email + password
    """
    user = await db.admin_users.find_one({"email": credentials.email})

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not verify_password(credentials.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={
            "sub": user["email"],
            "name": user["name"],
            "role": user["role"],
        },
        expires_delta=access_token_expires,
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

# ======================================================
# GET CURRENT ADMIN
# ======================================================
@router.get("/me")
async def get_current_user_info(
    current_user: dict = Depends(get_current_user)
):
    user = await db.admin_users.find_one(
        {"email": current_user["email"]}
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return {
        "id": user.get("id"),
        "email": user["email"],
        "name": user["name"],
        "role": user["role"],
    }

# ======================================================
# REGISTER NEW ADMIN (ADMIN ONLY)
# ======================================================
@router.post("/register", response_model=AdminUser)
async def register_admin(
    user: AdminUserCreate,
    current_user: dict = Depends(get_current_user),
):
    """
    Register a new admin (only existing admins can do this)
    """
    existing_user = await db.admin_users.find_one(
        {"email": user.email}
    )
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    user_dict = {
        "email": user.email,
        "name": user.name,
        "hashed_password": get_password_hash(user.password),
        "role": "admin",
    }

    admin_user = AdminUser(**user_dict)
    user_dict["id"] = admin_user.id
    user_dict["created_at"] = admin_user.created_at

    await db.admin_users.insert_one(user_dict)

    return admin_user
