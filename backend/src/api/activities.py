from fastapi import Depends, APIRouter
from sqlalchemy.orm import Session
from src.models.activity import Activity
from src.models.database import get_db
from pydantic import BaseModel
from src.schemas import ActivityCreate

router = APIRouter()

@router.get("/activities")
def get_activities(db: Session = Depends(get_db)):
    activities = db.query(Activity).all()
    return activities

@router.post("/activities")
def create_activity(activity: ActivityCreate, db: Session = Depends(get_db)):
    new_activity = Activity(name=activity.name, total_time=0)

    db.add(new_activity)
    db.commit()
    db.refresh(new_activity)
    return new_activity