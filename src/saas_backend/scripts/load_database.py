import json
import sqlite3

from saas_backend.auth.database import get_db


def load_database():
    with open("data/anime-offline-database.json", "r") as f:
        raw_data = json.load(f)

    for anime in raw_data["data"][:10]:
        print(anime)

    connection = next(get_db())



if __name__ == "__main__":
    load_database()
