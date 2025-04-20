from fastapi import APIRouter, HTTPException
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
