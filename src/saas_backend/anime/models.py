from pydantic import BaseModel


class AnimeModel(BaseModel):
    id: int
    title: str
    description: str
    image_url: str
    rating: float
    episode_count: int
    status: str
    year: int
    season: str
    tags: list[str]
    sources: list[str]
    reccomendation_string: str
