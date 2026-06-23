from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models import OfficialRequest, OfficialRequestStatus, User, RoleEnum
from schemas import OfficialRequestCreate, OfficialRequestResponse
from routers.dependencies import get_current_user, require_admin
from typing import List
from datetime import datetime

router = APIRouter(prefix="/requests", tags=["Official Requests"])

ADMIN_EMAIL = "241030@tkmce.ac.in"

@router.post("/official")
def request_official_role(
    payload: OfficialRequestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Only citizens can request
    if current_user.role != RoleEnum.citizen:
        raise HTTPException(
            status_code=400,
            detail="Only citizens can request official role"
        )

    # Check if already requested
    existing = db.query(OfficialRequest).filter(
        OfficialRequest.user_id == current_user.id
    ).first()

    if existing:
        if existing.status == OfficialRequestStatus.pending:
            raise HTTPException(
                status_code=400,
                detail="You already have a pending request"
            )
        if existing.status == OfficialRequestStatus.approved:
            raise HTTPException(
                status_code=400,
                detail="You are already an official"
            )
        # If rejected, allow re-application by updating the record
        existing.reason = payload.reason
        existing.status = OfficialRequestStatus.pending
        existing.reviewed_at = None
        db.commit()
        return {"message": "Request resubmitted successfully"}

    request = OfficialRequest(
        user_id=current_user.id,
        reason=payload.reason
    )
    db.add(request)
    db.commit()
    return {"message": "Request submitted successfully. Awaiting admin approval."}

@router.get("/official/my")
def my_request_status(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    request = db.query(OfficialRequest).filter(
        OfficialRequest.user_id == current_user.id
    ).first()
    if not request:
        return {"status": "not_requested"}
    return {
        "status": request.status,
        "reason": request.reason,
        "created_at": request.created_at,
        "reviewed_at": request.reviewed_at
    }

@router.get("/official/all", response_model=List[OfficialRequestResponse])
def all_requests(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    return db.query(OfficialRequest).order_by(
        OfficialRequest.created_at.desc()
    ).all()

@router.put("/official/{request_id}/approve")
def approve_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    req = db.query(OfficialRequest).filter(
        OfficialRequest.id == request_id
    ).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    if req.status != OfficialRequestStatus.pending:
        raise HTTPException(status_code=400, detail="Request already reviewed")

    # Approve — upgrade user role to official
    req.status = OfficialRequestStatus.approved
    req.reviewed_at = datetime.utcnow()
    user = db.query(User).filter(User.id == req.user_id).first()
    user.role = RoleEnum.official
    db.commit()
    return {"message": f"Approved. {user.name} is now an official."}

@router.put("/official/{request_id}/reject")
def reject_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    req = db.query(OfficialRequest).filter(
        OfficialRequest.id == request_id
    ).first()
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    if req.status != OfficialRequestStatus.pending:
        raise HTTPException(status_code=400, detail="Request already reviewed")

    req.status = OfficialRequestStatus.rejected
    req.reviewed_at = datetime.utcnow()
    db.commit()
    return {"message": "Request rejected."}

@router.get("/officials/all")
def all_officials(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    officials = db.query(User).filter(User.role == RoleEnum.official).all()
    return [
        {
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role,
            "created_at": u.created_at
        }
        for u in officials
    ]

@router.put("/officials/{user_id}/remove")
def remove_official(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.role != RoleEnum.official:
        raise HTTPException(status_code=400, detail="User is not an official")
    if user.email == "241030@tkmce.ac.in":
        raise HTTPException(status_code=403, detail="Cannot demote admin")

    # Downgrade to citizen
    user.role = RoleEnum.citizen

    # Also update their request record to reflect removal
    req = db.query(OfficialRequest).filter(
        OfficialRequest.user_id == user_id
    ).first()
    if req:
        req.status = OfficialRequestStatus.rejected

    db.commit()
    return {"message": f"{user.name} has been removed as official and reverted to citizen"}