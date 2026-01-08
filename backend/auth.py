from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os

# Configuration
SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "rids-ngo-secret-key-change-in-production-2025")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Security scheme
security = HTTPBearer()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash a password."""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_token(token: str) -> Optional[dict]:
    """Decode and verify a JWT token."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get the current authenticated user from the token."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    token = credentials.credentials
    payload = decode_token(token)
    
    if payload is None:
        raise credentials_exception
    
    email: str = payload.get("sub")
    if email is None:
        raise credentials_exception
    
    return {"email": email, "payload": payload}

def verify_admin(current_user: dict = Depends(get_current_user)):
    """Verify that the current user is an admin."""
    # All authenticated users are admins in this system
    return current_user

# ======================================================
# TEMPORARY: CREATE FIRST ADMIN (REMOVE AFTER USE)
# ======================================================
from fastapi import APIRouter
from db import get_db

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/_create-admin")
async def _create_admin():
    """
    TEMPORARY endpoint to create first admin user.
    REMOVE AFTER SUCCESSFUL LOGIN.
    """
    db = get_db()

    admin_email = "admin@rids.org"
    admin_password = "admin123"

    # Check if admin already exists
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

