from fastapi import APIRouter

router = APIRouter()

@router.get("/auth/check")  
async def auth_check():
    return {"status":"endpoint working"}  
