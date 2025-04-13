from fastapi import APIRouter
from rapidfuzz import process

from saas_backend.auth.database import get_db
from saas_backend.auth.models import Anime

router = APIRouter(prefix="/anime", tags=["anime"])


@router.get("/search")
async def search_anime(query: str, limit: int = 10, offset: int = 0):
    connection = next(get_db())

    anime = [
        anime.title
        for anime in connection.query(Anime).limit(limit).offset(offset).all()
    ]

    results = process.extract(query, anime)

    return results


@router.get("/recommendations")
async def get_recommendations(anime_ids: list[int] = []):
    connection = next(get_db())

    anime = connection.query(Anime).filter(Anime.id.in_(anime_ids)).all()

    recommendations = anime.recommendations
