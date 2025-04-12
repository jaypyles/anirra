import hashlib
from saas_backend.auth.jwt_handler import JwtHandler
from saas_backend.auth.database import get_db
from saas_backend.auth.models import APIKey, User
from fastapi import HTTPException, Header


class UserManager:
    def __init__(self):
        pass

    @staticmethod
    async def get_user_from_header(
        token: str | None = Header(None, alias="Authorization"),
        api_key: str | None = Header(None, alias="X-API-Key"),
    ) -> User:
        if not token and not api_key:
            raise HTTPException(status_code=401, detail="Missing token or API key")

        return UserManager.get_user(token, api_key)

    @staticmethod
    def get_user(access_token: str | None, api_key: str | None) -> User:
        if access_token:
            return UserManager.get_user_from_access_token(access_token)
        elif api_key:
            return UserManager.get_user_from_api_key(api_key)
        else:
            raise HTTPException(status_code=401, detail="Missing token or API key")

    @staticmethod
    def get_user_credits(user_id: int) -> int | None:
        db = next(get_db())
        user = db.query(User).filter(User.id == user_id).first()

        if user is None:
            raise HTTPException(status_code=404, detail="User not found")

        return user.credits

    @staticmethod
    def decrement_user_credits(user_id: int):
        db = next(get_db())
        user = db.query(User).filter(User.id == user_id).first()

        if user is None:
            raise HTTPException(status_code=404, detail="User not found")

        user.credits -= 1  # pyright: ignore[reportAttributeAccessIssue]
        db.commit()

    @staticmethod
    def get_user_from_db(user_id: int) -> User:
        db = next(get_db())
        user = db.query(User).filter(User.id == user_id).first()

        if user is None:
            raise HTTPException(status_code=404, detail="User not found")

        return user

    @staticmethod
    def get_user_from_access_token(access_token: str) -> User:
        access_token = (
            access_token.split(" ")[1] if " " in access_token else access_token
        )

        _ = JwtHandler.is_expired(access_token)
        decoded = JwtHandler.decode(access_token)

        return UserManager.get_user_from_db(decoded["id"])

    @staticmethod
    def get_user_from_api_key(api_key: str) -> User:
        db = next(get_db())
        api_key = db.query(APIKey).filter(APIKey.api_key == api_key).first()

        if api_key is None:
            raise HTTPException(status_code=401, detail="Invalid API key")

        return UserManager.get_user_from_db(api_key.user_id)

    @staticmethod
    def authenticate_user(username: str, password: str) -> User:
        db = next(get_db())
        user = db.query(User).filter(User.username == username).first()
        hashed_password = hashlib.sha256(password.encode()).hexdigest()

        if user is None or not (user.hashed_password == hashed_password):
            raise HTTPException(
                status_code=401,
                detail="Invalid username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        return user
