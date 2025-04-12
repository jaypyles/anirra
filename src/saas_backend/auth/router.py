import hashlib
from fastapi import APIRouter, HTTPException, Depends, Header
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordRequestForm
import sqlalchemy
from sqlalchemy.orm import Session
from datetime import timedelta
import jwt
import uuid

from saas_backend.auth.jwt_handler import JwtHandler
from saas_backend.auth.database import get_db
from saas_backend.auth.models import User, APIKey, BaseUser
from saas_backend.logger import LOG
from saas_backend.auth.constants import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
)
from saas_backend.auth.user_manager import UserManager

router = APIRouter()


@router.post("/login")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
):
    user = UserManager.authenticate_user(form_data.username, form_data.password)

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = JwtHandler.create_access_token(
        data={
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "credits": user.credits,
        },
        expires_delta=access_token_expires,
    )

    response = JSONResponse(content={"message": "User logged in successfully"})
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
    )

    return response


@router.post("/logout")
async def logout_user(token: str = Header(..., alias="Authorization")):
    try:
        try:
            user = UserManager.get_user_from_access_token(token)

        except HTTPException:
            JwtHandler.remove_token(token)  # already expired
            return {"message": "User logged out successfully"}

        if user is None:
            raise HTTPException(status_code=401, detail="Invalid token")

    except jwt.PyJWTError as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=401, detail="Invalid token")

    JwtHandler.expire_token(token)

    return {"message": "User logged out successfully"}


@router.post("/register")
async def register_user(user: BaseUser, db: Session = Depends(get_db)):
    try:
        new_user = User(
            username=user.username,
            hashed_password=hashlib.sha256(user.password.encode()).hexdigest(),
        )

        db.add(new_user)
        db.commit()
    except sqlalchemy.exc.IntegrityError:
        raise HTTPException(
            status_code=400, detail=str("User with this username already exists")
        )

    return {"message": "User registered successfully"}


@router.put("/api-key")
async def create_api_key(
    token: str = Header(..., alias="Authorization"), db: Session = Depends(get_db)
):
    api_key = uuid.uuid4().hex
    user = UserManager.get_user_from_access_token(token)

    new_api_key = APIKey(user_id=user.id, api_key=api_key)
    db.add(new_api_key)
    db.commit()

    return {"message": "API key created successfully", "api_key": api_key}


@router.get("/api-key")
async def get_api_key(
    user: User = Depends(UserManager.get_user_from_header),
    db: Session = Depends(get_db),
):
    api_key = db.query(APIKey).filter(APIKey.user_id == user.id).first()

    if api_key is None:
        raise HTTPException(status_code=404, detail="API key not found")

    return {"message": "API key retrieved successfully", "api_key": api_key.api_key}


@router.delete("/api-key")
async def delete_api_key(
    user: User = Depends(UserManager.get_user_from_header),
    db: Session = Depends(get_db),
):
    try:
        api_key = db.query(APIKey).filter(APIKey.user_id == user.id).first()

        if api_key is None:
            raise HTTPException(status_code=404, detail="API key not found")

        _ = db.query(APIKey).filter(APIKey.user_id == user.id).delete()
        db.commit()
        return {"message": "API key deleted successfully"}
    except Exception as e:
        LOG.error(f"Error deleting API key: {e}")
        raise HTTPException(status_code=500, detail="Error deleting API key")
