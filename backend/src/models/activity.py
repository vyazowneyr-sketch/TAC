from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from src.models.user import Base
from datetime import datetime

class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    total_time = Column(Integer, default=0)

    created_at = Column(DateTime, default=datetime.utcnow)
