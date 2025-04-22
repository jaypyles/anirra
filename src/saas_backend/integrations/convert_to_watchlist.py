from typing import BinaryIO
import xml.etree.ElementTree as ET
from sqlalchemy.orm import Session
from saas_backend.auth.models import Watchlist, WatchlistToAnime, Anime
from saas_backend.auth.database import get_db

from logging import getLogger

logger = getLogger(__name__)


def convert_from_mal_status(status: str) -> str:
    if status == "Completed":
        return "WATCHED"
    elif status == "Plan to Watch":
        return "PLANNING"
    elif status == "Dropped":
        return "DROPPED"
    else:
        return "WATCHING"


def xml_to_watchlist(xml_file: BinaryIO, user_id: int):
    # Parse the XML file
    tree = ET.parse(xml_file)
    root = tree.getroot()

    connection: Session = next(get_db())

    watchlist = connection.query(Watchlist).filter(Watchlist.user_id == user_id).first()  # type: ignore

    if not watchlist:
        logger.info(f"Watchlist not found for user {user_id}, creating new watchlist")
        watchlist = Watchlist(user_id=user_id)
        connection.add(watchlist)
        connection.commit()  # Commit to ensure the new watchlist has an ID

    animes = root.findall("anime")

    if not animes:
        raise ValueError("No animes found in the XML file")

    for anime in animes:
        status = convert_from_mal_status(anime.find("my_status").text or "")  # type: ignore

        # Check if the anime already exists in the database
        existing_anime = connection.query(Anime).filter(Anime.title == anime.find("series_title").text).first()  # type: ignore

        logger.info(
            f"Checking if anime {anime.find('series_title').text} exists in the database"  # type: ignore
        )

        if not existing_anime:
            logger.info(f"Anime did not exist in the database")
            continue

        entry = connection.query(WatchlistToAnime).filter(WatchlistToAnime.watchlist_id == watchlist.id, WatchlistToAnime.anime_id == existing_anime.id).first()  # type: ignore

        if entry:
            logger.info(f"Anime {existing_anime.title} already exists in the watchlist")
            continue

        # Create a WatchlistToAnime entry
        watchlist_to_anime = WatchlistToAnime(
            watchlist_id=watchlist.id,
            anime_id=existing_anime.id,
            status=status,
        )

        connection.add(watchlist_to_anime)

    # Commit all changes to the database
    connection.commit()
    connection.close()
