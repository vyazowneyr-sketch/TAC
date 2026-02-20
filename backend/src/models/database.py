from src.core.config import settings
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from src.models.user import Base

engine = create_engine(str(settings.DATABASE_URL))
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
