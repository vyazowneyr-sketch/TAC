from fastapi import APIRouter, Depends, HTTPException
from src.schemas import UserResponse, UserCreate
from src.models.database import get_db
from sqlalchemy.orm import Session
from src.models.user import User
from src.services.auth import get_password_hash


router = APIRouter()

@router.get("/auth/check")  
async def auth_check():
    return {"status":"endpoint working"}  

@router.post("/register", response_model = UserResponse)
def register(user_data: UserCreate,  db: Session = Depends(get_db)):
    existing = db.query(User).filter(
        (User.email == user_data.email) | (User.username == user_data.username)
    ).first()
    if existing:
        raise HTTPException(status_code = 400, detail = 'Такой пользователь уже сущесвует')
    
    hashed_password = get_password_hash(user_data.password)

    new_user = User(
        email = user_data.email,
        username = user_data.username,
        hashed_password = hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user