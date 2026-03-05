import secrets
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from pydantic import BaseModel
from src.schemas import UserResponse, UserCreate, LoginRequest, Token
from src.models.database import get_db
from sqlalchemy.orm import Session
from src.models.user import User
from src.services.auth import get_password_hash, verify_password, create_access_token
from src.services.email import send_verification_email_background
from src.services.google_auth import verify_google_token

router = APIRouter()

@router.get("/auth/check")  
async def auth_check():
    return {"status":"endpoint working"}  

@router.post("/register", response_model = UserResponse)
def register(user_data: UserCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    existing = db.query(User).filter(
        (User.email == user_data.email) | (User.username == user_data.username)
    ).first()
    if existing:
        raise HTTPException(status_code = 400, detail = 'Такой пользователь уже сущесвует')
    
    hashed_password = get_password_hash(user_data.password)
    token = secrets.token_urlsafe(32)

    new_user = User(
        email = user_data.email,
        username = user_data.username,
        hashed_password = hashed_password,
        verification_token = token
    )

    db.add(new_user)
    db.commit()
    
    send_verification_email_background(background_tasks, user_data.email, token)
    db.refresh(new_user)

    return new_user

@router.post("/login", response_model = Token)
def login(user_data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_data.email).first()

    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(status_code = 401, detail = "Неверный email или пароль")
    #if user.verification_token is not None:
    #    raise HTTPException(status_code = 403, detail = "Сначала вам необходимо подтвердить Email")
    
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token":access_token, "token_type": "bearer"}

@router.get("/verify/{token}")
def verify_token(token: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.verification_token == token).first()
    if not user:
        raise HTTPException(status_code = 404, detail = "Email не подвержден")
    
    user.verification_token = None
    db.commit()
    return {"message": "Email подтверждён!"}

@router.post("/auth/google")
async def google_login(request: dict, db: Session = Depends(get_db)):
    token = request.get("token")
    google_user = await verify_google_token(token)
    email = google_user["email"]

    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(
            email = email,
            username = email.split("@")[0],
            hashed_password = "google_auth",
            verification_token = None
        )
        db.add(user)
        db.commit()

    jwt_token = create_access_token(data = {"sub": email})
    return {"access_token": jwt_token, "token_type": "bearer"}
