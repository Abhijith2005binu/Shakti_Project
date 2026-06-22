from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models import Grievance, GrievanceUpdate, Department, StatusEnum, User
from schemas import StatusUpdate
from routers.dependencies import get_current_user, require_official
from typing import Optional

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/grievances")
def all_grievances(
    status: Optional[str] = None,
    department_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_official)
):
    query = db.query(Grievance)
    if status:
        query = query.filter(Grievance.status == status)
    if department_id:
        query = query.filter(Grievance.department_id == department_id)
    return query.order_by(Grievance.created_at.desc()).all()

@router.put("/grievances/{grievance_id}/assign")
def assign_grievance(
    grievance_id: int,
    department_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_official)
):
    grievance = db.query(Grievance).filter(Grievance.id == grievance_id).first()
    if not grievance:
        raise HTTPException(status_code=404, detail="Grievance not found")
    grievance.department_id = department_id
    db.commit()
    return {"message": "Assigned successfully"}

@router.put("/grievances/{grievance_id}/status")
def update_status(
    grievance_id: int,
    payload: StatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_official)
):
    grievance = db.query(Grievance).filter(Grievance.id == grievance_id).first()
    if not grievance:
        raise HTTPException(status_code=404, detail="Grievance not found")
    grievance.status = payload.status
    update = GrievanceUpdate(
        grievance_id=grievance_id,
        note=payload.note,
        status=payload.status,
        updated_by=current_user.id
    )
    db.add(update)
    db.commit()
    return {"message": "Status updated"}

@router.get("/analytics")
def analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_official)
):
    total = db.query(Grievance).count()
    open_count = db.query(Grievance).filter(Grievance.status == "open").count()
    in_progress = db.query(Grievance).filter(Grievance.status == "in_progress").count()
    resolved = db.query(Grievance).filter(Grievance.status == "resolved").count()
    return {
        "total": total,
        "open": open_count,
        "in_progress": in_progress,
        "resolved": resolved
    }

@router.get("/departments")
def list_departments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Department).all()

@router.post("/departments")
def create_department(
    name: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_official)
):
    dept = Department(name=name)
    db.add(dept)
    db.commit()
    db.refresh(dept)
    return {"message": "Department created", "id": dept.id}