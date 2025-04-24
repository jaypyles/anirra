from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from saas_backend.auth.database import get_db
from saas_backend.auth.models import User, Watchlist, WatchlistToAnime, Anime
from saas_backend.auth.user_manager.user_manager import UserManager
from saas_backend.integrations.convert_to_watchlist import xml_to_watchlist
from saas_backend.integrations.request_models import (
    RadarrAddRequest,
    SonarrAddRequest,
)
from saas_backend.utils import read_config, to_dict
import requests
import json
import logging

logger = logging.getLogger("integrations-router")

router = APIRouter(prefix="/integrations", tags=["integrations"])


@router.get("/jellyfin")
async def get_jellyfin_integrations():
    config = read_config("jellyfin")
    return config


@router.get("/sonarr/search")
async def search_sonarr(query: str):
    config = read_config("sonarr")

    response = requests.get(
        f"{config['url']}/api/v3/series/lookup?term={query}&apiKey={config['api_key']}"
    )

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.text)

    return response.json()


@router.post("/sonarr/add")
async def add_sonarr_series(request: SonarrAddRequest):
    config = read_config("sonarr")
    url = f"{config['url']}/api/v3/series?apiKey={config['api_key']}"
    response = requests.post(url, json=request.model_dump())

    print(response.status_code)

    return response.json()


@router.get("/radarr/search")
async def search_radarr(query: str):
    config = read_config("radarr")

    response = requests.get(
        f"{config['url']}/api/v3/movie/lookup?term={query}&apiKey={config['api_key']}"
    )

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.text)

    return response.json()


@router.post("/radarr/add")
async def add_radarr_series(request: RadarrAddRequest):
    config = read_config("radarr")
    url = f"{config['url']}/api/v3/movie?apiKey={config['api_key']}"
    response = requests.post(url, json=request.model_dump())

    print(response.status_code)

    return response.json()


@router.get("/settings")
async def get_settings():
    try:
        sonarr_config = read_config("sonarr")
        radarr_config = read_config("radarr")
        jellyfin_config = read_config("jellyfin")

        enabled_integrations = []

        if sonarr_config:
            enabled_integrations.append("sonarr")
        if radarr_config:
            enabled_integrations.append("radarr")
        if jellyfin_config:
            enabled_integrations.append("jellyfin")

        logger.info(f"Enabled integrations: {enabled_integrations}")

        return enabled_integrations
    except FileNotFoundError as e:
        logger.error(f"Error getting settings: {e}")
        return []


@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...), user: User = Depends(UserManager.get_user_from_header)
):
    xml_to_watchlist(file.file, user_id=user.id)

    return {"message": "XML file converted to watchlist"}


@router.get("/export")
async def export_watchlist(user: User = Depends(UserManager.get_user_from_header)):
    connection = next(get_db())

    watchlist = connection.query(Watchlist).filter(Watchlist.user_id == user.id).first()  # type: ignore

    if not watchlist:
        raise HTTPException(status_code=404, detail="Watchlist not found")

    watchlist_to_animes = connection.query(WatchlistToAnime).filter(WatchlistToAnime.watchlist_id == watchlist.id).all()  # type: ignore

    compiled_watchlist = []

    for watchlist_to_anime in watchlist_to_animes:
        anime = connection.query(Anime).filter(Anime.id == watchlist_to_anime.anime_id).first()  # type: ignore
        compiled_watchlist.append(
            {
                **to_dict(anime),
                "user_rating": watchlist_to_anime.rating,
                "status": watchlist_to_anime.status,
            }
        )

    return {"watchlist": compiled_watchlist}


@router.post("/import")
async def import_watchlist(
    file: UploadFile = File(...), user: User = Depends(UserManager.get_user_from_header)
):
    logger.info(f"Importing watchlist for user {user.username}")

    connection = next(get_db())
    data = json.loads(await file.read())

    watchlist = connection.query(Watchlist).filter(Watchlist.user_id == user.id).first()  # type: ignore

    if not watchlist:
        logger.info(
            f"Watchlist not found for user {user.username}, creating new watchlist"
        )
        connection.add(Watchlist(user_id=user.id))
        connection.commit()
    else:
        logger.info(f"Watchlist found for user {user.username}")

    for anime in data["watchlist"]:
        watchlist_to_anime_entry = (
            connection.query(WatchlistToAnime)
            .filter(WatchlistToAnime.anime_id == anime["id"])
            .first()
        )

        if not watchlist_to_anime_entry:
            watchlist_to_anime = WatchlistToAnime(
                watchlist_id=watchlist.id,  # type: ignore
                anime_id=anime["id"],
                rating=anime["user_rating"],
                status=anime["status"],
            )

            logger.info(f"Adding watchlist to anime {anime['id']}")
            connection.add(watchlist_to_anime)
        else:
            watchlist_to_anime_entry.rating = anime["user_rating"]
            watchlist_to_anime_entry.status = anime["status"]

            logger.info(f"Updating watchlist to anime {anime['id']}")
            connection.add(watchlist_to_anime_entry)

    connection.commit()

    return {"message": "Watchlist imported"}
