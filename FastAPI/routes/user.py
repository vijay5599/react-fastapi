from fastapi import FastAPI, APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session
from typing_extensions import Annotated, List
from database import SessionLocal, connect
from models import models
from schemas import schema


user = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependancy = Annotated[Session, Depends(get_db)]


@user.post("/", status_code=status.HTTP_201_CREATED)
async def create_user(request: schema.UserSchema, db: db_dependancy):
    user = models.Users(
        name=request.name, email=request.email, password=request.password
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@user.get("/", response_model=List[schema.UserSchema])
async def get_users(db: db_dependancy):
    return db.query(models.Users).all()


@user.get("/{id}", response_model=schema.ShowUser)
async def show_user(id, db: db_dependancy):
    user = db.query(models.Users).filter(models.Users.id == id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@user.put(
    "/{id}", response_model=schema.UserSchema, status_code=status.HTTP_202_ACCEPTED
)
async def update_user(id, request: schema.UserSchema, db: db_dependancy):
    user = db.query(models.Users).filter(models.Users.id == id).first()
    if not user:
        raise HTTPException(status_code=404, detail=f"User with ID {id} not found")
    user.name = request.name
    user.email = request.email
    user.password = request.password
    db.commit()
    return user


@user.delete("/{id}")
async def delete_user(id, db: db_dependancy):
    user = db.query(models.Users).filter(models.Users.id == id).first()
    if not user:
        raise HTTPException(status_code=404, detail=f"User with ID {id} not found")
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}
