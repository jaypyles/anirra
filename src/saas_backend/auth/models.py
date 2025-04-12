from typing import final

from pydantic import BaseModel
from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String

from saas_backend.auth.database import Base, engine


class BaseUser(BaseModel):
    username: str
    password: str


@final
class User(Base):
    __tablename__ = "user"
    id = Column(Integer, primary_key=True, index=True, unique=True, autoincrement=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    credits = Column(Integer, default=1)
    api_key_id = Column(Integer, ForeignKey("api_key.id"))


@final
class APIKey(Base):
    __tablename__ = "api_key"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("user.id"))
    api_key = Column(String)


@final
class Blacklist(Base):
    __tablename__ = "blacklist"
    id = Column(Integer, primary_key=True, index=True)
    jti = Column(String, unique=True, index=True)
    expires_at = Column(DateTime, index=True)


@final
class Anime(Base):
    __tablename__ = "anime"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    image_url = Column(String)
    rating = Column(Float)
    episode_count = Column(Integer)
    status = Column(String)
    year = Column(Integer)
    season = Column(String)
    genres = Column(String)
    episodes = Column(String)
    

Base.metadata.create_all(bind=engine)
