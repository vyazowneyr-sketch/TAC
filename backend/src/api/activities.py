from fastapi import Depends, APIRouter, HTTPException
from sqlalchemy.orm import Session
from src.models.activity import Activity
from src.models.user import User
from src.models.database import get_db
from pydantic import BaseModel
from src.schemas import ActivityCreate
from src.services.auth import get_current_user

router = APIRouter()

@router.get("/activities")
def get_activities(current_user: User = Depends(get_current_user),db: Session = Depends(get_db)):
    activities = db.query(Activity).filter(Activity.user_id == current_user.id).all()
    return activities

@router.post("/activities")
def create_activity(activity: ActivityCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    new_activity = Activity(name=activity.name, total_time=0, user_id=current_user.id)

    db.add(new_activity)
    db.commit()
    db.refresh(new_activity)
    return new_activity

@router.put("/activities/{activity_id}")
def update_time(activity_id: int, time_add: int,current_user: User = Depends(get_current_user) ,db: Session = Depends(get_db)):
    activity = db.query(Activity).filter(Activity.id == activity_id, Activity.user_id == current_user.id).first()
    if not activity:
        raise HTTPException(status_code = 404, detail="Активность не найдена")
    activity.total_time = (activity.total_time or 0) + time_add
    db.commit()
    return activity