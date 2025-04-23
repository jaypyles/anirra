import hashlib
import os
from saas_backend.auth.database import get_db
from saas_backend.auth.models import (
    Anime,
    AnimeStatus,
    User,
    Watchlist,
    WatchlistToAnime,
)
from saas_backend.scripts.load_database import load_database


def on_startup():
    connection = next(get_db())

    if not connection.query(Anime).count():
        load_database()

    admin_user = connection.query(User).filter(User.username == "admin").first()  # type: ignore

    if not admin_user:
        admin_user = User(
            id=999,
            username="admin",
            email="admin@admin.com",
            hashed_password=hashlib.sha256("admin".encode()).hexdigest(),
        )

    connection.add(admin_user)

    if os.getenv("APP_MODE") == "PROD":
        print("Production mode, skipping watchlist setup...")
        connection.commit()
        connection.close()
        return

    watchlist = connection.query(Watchlist).filter(Watchlist.user_id == admin_user.id).first()  # type: ignore

    if not watchlist:
        watchlist = Watchlist(id=999, user_id=admin_user.id)

    anime_to_watchlist = (
        connection.query(WatchlistToAnime)
        .filter(WatchlistToAnime.watchlist_id == watchlist.id)  # type: ignore
        .first()
    )

    if not anime_to_watchlist:
        anime_to_watchlist = WatchlistToAnime(
            watchlist_id=999, anime_id=20766, status=AnimeStatus.WATCHING
        )

    connection.add(watchlist)
    connection.add(anime_to_watchlist)

    connection.commit()
    connection.close()
