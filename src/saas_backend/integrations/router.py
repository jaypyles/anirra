from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from saas_backend.auth.models import User
from saas_backend.auth.user_manager.user_manager import UserManager
from saas_backend.integrations.convert_to_watchlist import xml_to_watchlist
from saas_backend.integrations.request_models import (
    RadarrAddRequest,
    SonarrAddRequest,
)
from saas_backend.utils import read_config
import requests

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

        return enabled_integrations
    except FileNotFoundError:
        return []


@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...), user: User = Depends(UserManager.get_user_from_header)
):
    xml_to_watchlist(file.file, user_id=user.id)

    return {"message": "XML file converted to watchlist"}
