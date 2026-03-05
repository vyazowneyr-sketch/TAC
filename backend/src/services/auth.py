import bcrypt
from src.models.user import User
from src.core.config import settings 
from datetime import timedelta, datetime
from typing import Optional
from jose import JWTError, jwt
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from src.models.database import get_db
from sqlalchemy.orm import Session
from src.services.google_auth import verify_google_token

security = HTTPBearer()

def get_password_hash(password:str):
    return bcrypt.hashpw(password.encode('utf-8'),bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password, hashed_password):
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=30)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code = 401, detail="Неверный токен")
    except JWTError:
        raise HTTPException(status_code = 401, detail = "Неверный токен")
    
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(status_code = 401, detail="Пользователь не найден")
    return user

