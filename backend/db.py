import os
from motor.motor_asyncio import AsyncIOMotorClient

# Global cached client (required for serverless)
_client = None

def get_db():
    """
    Returns a MongoDB database instance.
    Safe for Vercel serverless environments.
    """
    global _client

    mongo_url = os.getenv("MONGO_URL")
    if not mongo_url:
        raise RuntimeError("MONGO_URL environment variable not set")

    if _client is None:
        _client = AsyncIOMotorClient(
            mongo_url,
            serverSelectionTimeoutMS=5000,   # ⏱ fail fast
            connectTimeoutMS=5000,
        )

    db_name = os.getenv("DB_NAME", "rids_ngo")
    return _client[db_name]
