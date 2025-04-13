from fastapi import APIRouter, HTTPException, Query
from rapidfuzz import process

from saas_backend.auth.database import get_db
from saas_backend.auth.models import Anime
from saas_backend.anime.utils import get_recommendations

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
async def get_anime_recommendations(ids: list[int] = Query(default=[])):
    return await get_recommendations(ids)


@router.get("/{id}")
async def get_anime(id: int):
    connection = next(get_db())
    anime = connection.query(Anime).filter(Anime.id == id).first()  # type: ignore

    if anime is None:
        raise HTTPException(status_code=404, detail="Anime not found")

    return anime
