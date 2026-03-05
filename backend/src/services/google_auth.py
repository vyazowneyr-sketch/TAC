import httpx
from src.core.config import settings
from datetime import datetime
from jose import jwt

async def verify_google_token(id_token: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"https://oauth2.googleapis.com/tokeninfo?id_token={id_token}")

    if response.status_code != 200:
        raise Exception("Invalid Google token")
    return response.json()

