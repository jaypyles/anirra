from pydantic import BaseModel


class UpdateWatchlist(BaseModel):
    anime: list[int]
    request: str
    status: str
