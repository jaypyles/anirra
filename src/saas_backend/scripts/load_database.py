import json
import os

from saas_backend.auth.database import get_db
from saas_backend.auth.models import Anime

JSON_DATA_PATH = os.getenv("JSON_DATA_PATH", "./data/anime-offline-database.json")


def load_database():
    connection = next(get_db())

    with open(JSON_DATA_PATH, "r") as f:
        raw_data = json.load(f)

    print(len(raw_data["data"]))

    for anime in raw_data["data"]:
        # Get score if it exists, then get median if score exists
        score = anime.get("score", {})
        rating = score.get("median") if score else None

        # Get anime season if it exists
        anime_season = anime.get("animeSeason", {})
        year = anime_season.get("year") if anime_season else None
        season = anime_season.get("season") if anime_season else None

        anime_model = Anime(
            title=anime.get("title"),
            image_url=anime.get("picture"),
            rating=rating,
            status=anime.get("status"),
            year=year,
            season=season,
            episode_count=anime.get("episodes"),
            tags=anime.get("tags", []),
            sources=anime.get("sources", []),
            reccomendation_string=f"{anime.get('title')} {anime.get('season')} {anime.get('year')} {' '.join(anime.get('tags', []))}",
        )

        connection.add(anime_model)

    connection.commit()
    connection.close()


if __name__ == "__main__":
    load_database()
