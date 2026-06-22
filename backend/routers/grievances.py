from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Grievance, GrievanceUpdate, Rating, StatusEnum
from schemas import GrievanceCreate, StatusUpdate, RatingCreate, GrievanceResponse
from routers.dependencies import get_current_user
from models import User
from typing import List

router = APIRouter(prefix="/grievances", tags=["Grievances"])

@router.post("/")
def submit_grievance(
    payload: GrievanceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    grievance = Grievance(
        title=payload.title,
        description=payload.description,
        category=payload.category,
        location=payload.location,
        citizen_id=current_user.id
    )
    db.add(grievance)
    db.commit()
    db.refresh(grievance)
    return {"message": "Grievance submitted", "id": grievance.id}

@router.get("/my", response_model=List[GrievanceResponse])
def my_grievances(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Grievance).filter(
        Grievance.citizen_id == current_user.id
    ).order_by(Grievance.created_at.desc()).all()

@router.get("/{grievance_id}", response_model=GrievanceResponse)
def get_grievance(
    grievance_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    grievance = db.query(Grievance).filter(Grievance.id == grievance_id).first()
    if not grievance:
        raise HTTPException(status_code=404, detail="Grievance not found")
    return grievance

@router.get("/{grievance_id}/timeline")
def get_timeline(
    grievance_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    updates = db.query(GrievanceUpdate).filter(
        GrievanceUpdate.grievance_id == grievance_id
    ).order_by(GrievanceUpdate.created_at.asc()).all()
    return updates

@router.post("/{grievance_id}/rate")
def rate_grievance(
    grievance_id: int,
    payload: RatingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not 1 <= payload.score <= 5:
        raise HTTPException(status_code=400, detail="Score must be between 1 and 5")
    rating = Rating(
        grievance_id=grievance_id,
        citizen_id=current_user.id,
        score=payload.score
    )
    db.add(rating)
    db.commit()
    return {"message": "Rating submitted"}