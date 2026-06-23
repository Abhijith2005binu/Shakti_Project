from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
import models
from routers import auth, grievances, admin, requests 
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Citizen Grievance Portal API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(grievances.router)
app.include_router(admin.router)
app.include_router(requests.router)

@app.get("/")
def root():
    return {"message": "Grievance Portal API is running"}


