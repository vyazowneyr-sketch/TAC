import httpx
import logging

logger = logging.getLogger(__name__)

async def verify_google_token(access_token: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            headers={"Authorization": f"Bearer {access_token}"}
        )

    logger.info(f"Google response status: {response.status_code}")
    logger.info(f"Google response body: {response.text}")
    
    if response.status_code != 200:
        raise Exception(f"Invalid Google token: {response.text}")
    return response.json()

