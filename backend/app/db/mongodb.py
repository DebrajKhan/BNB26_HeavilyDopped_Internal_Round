from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

class MongoDB:
    client: AsyncIOMotorClient = None
    db = None

db_client = MongoDB()

async def connect_to_mongo():
    db_client.client = AsyncIOMotorClient(settings.MONGODB_URI)
    db_client.db = db_client.client.cleverbook

async def close_mongo_connection():
    db_client.client.close()