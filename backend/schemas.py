from pydantic import BaseModel, EmailStr
from enum import Enum
from typing import Optional
from datetime import datetime

class RoleEnum(str, Enum):
    citizen = "citizen"
    official = "official"
    admin = "admin"

class StatusEnum(str, Enum):
    open = "open"
    in_progress = "in_progress"
    resolved = "resolved"
    closed = "closed"

# ─── Auth ───────────────────────────────────────────
class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: RoleEnum = RoleEnum.citizen

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    role: str
    name: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

# ─── Grievance ──────────────────────────────────────
class GrievanceCreate(BaseModel):
    title: str
    description: str
    category: str
    location: str

class GrievanceResponse(BaseModel):
    id: int
    title: str
    description: str
    category: str
    location: str
    status: StatusEnum
    created_at: datetime

    class Config:
        from_attributes = True

# ─── Status Update ──────────────────────────────────
class StatusUpdate(BaseModel):
    status: StatusEnum
    note: str

# ─── Rating ─────────────────────────────────────────
class RatingCreate(BaseModel):
    score: int