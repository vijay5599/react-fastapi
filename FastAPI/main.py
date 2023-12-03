from fastapi import FastAPI, APIRouter, Depends, status, HTTPException
from routes import user
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# origin = "http://localhost:5173"

app.add_middleware(
    CORSMiddleware,
    allow_origins="http://localhost:5173",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(user.user)
