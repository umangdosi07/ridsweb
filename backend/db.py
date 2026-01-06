# backend/db.py
import os
from motor.motor_asyncio import AsyncIOMotorClient

_client = None

def get_db():
    global _client
    if _client is None:
        mongo_url = os.getenv("MONGO_URL")
        if not mongo_url:
            raise RuntimeError("MONGO_URL environment variable not set")

        _client = AsyncIOMotorClient(
            mongo_url,
            serverSelectionTimeoutMS=5000
        )

    db_name = os.getenv("DB_NAME", "rids_ngo")
    return _client[db_name]
