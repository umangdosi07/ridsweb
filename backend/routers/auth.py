from fastapi import APIRouter, HTTPException, status, Depends
from motor.motor_asyncio import AsyncIOMotorClient
import os
from datetime import datetime, timedelta

from models import AdminUserCreate, AdminUserLogin, AdminUser, Token
from auth import (
    get_password_hash,
    verify_password,
    create_access_token,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    get_current_user,
)

# ======================================================
# ROUTER
# ======================================================
router = APIRouter(prefix="/auth", tags=["Authentication"])

# ======================================================
# DATABASE
# ======================================================
MONGO_URL = os.environ.get("MONGO_URL")
DB_NAME = os.environ.get("DB_NAME", "rids_ngo")

if not MONGO_URL:
    raise RuntimeError("MONGO_URL not set")

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

# ======================================================
# SETUP INITIAL ADMIN (ONE TIME ONLY)
# ======================================================
@router.post("/setup")
async def setup_initial_admin():
    """
    Create the first admin user if none exists.
    Can be executed ONLY ONCE.
    """
    admin_count = await db.admin_users.count_documents({})
    if admin_count > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Admin already exists. Use /login."
        )

    password = "admin123"

    user_data = {
        "email": "admin@rids.org",
        "name": "Admin",
        "hashed_password": get_password_hash(password),
        "role": "admin",
        "is_active": True,
        "created_at": datetime.utcnow(),
    }

    admin_user = AdminUser(**user_data)
    user_data["id"] = admin_user.id

    await db.admin_users.insert_one(user_data)

    return {
        "message": "Initial admin created successfully",
        "email": "admin@rids.org",
        "password": password,
        "note": "Change password after first login"
    }

# ======================================================
# ADMIN LOGIN
# ======================================================
@router.post("/login", response_model=Token)
async def login(credentials: AdminUserLogin):
    """
    Admin login with email & password
    """
    try:
        user = await db.admin_users.find_one(
            {"email": credentials.email}
        )

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        if "hashed_password" not in user:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="User record corrupted"
            )

        if not verify_password(
            credentials.password,
            user["hashed_password"]
        ):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        access_token = create_access_token(
            data={
                "sub": user["email"],
                "role": user["role"],
                "name": user.get("name", ""),
            },
            expires_delta=timedelta(
                minutes=ACCESS_TOKEN_EXPIRE_MINUTES
            ),
        )

        return {
            "access_token": access_token,
            "token_type": "bearer"
        }

    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed"
        )

# ======================================================
# CURRENT ADMIN INFO
# ======================================================
@router.get("/me")
async def get_current_admin(
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
    existing = await db.admin_users.find_one(
        {"email": user.email}
    )
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    user_data = {
        "email": user.email,
        "name": user.name,
        "hashed_password": get_password_hash(user.password),
        "role": "admin",
        "created_at": datetime.utcnow(),
    }

    admin_user = AdminUser(**user_data)
    user_data["id"] = admin_user.id

    await db.admin_users.insert_one(user_data)

    return admin_user
