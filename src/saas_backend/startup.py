import hashlib
from saas_backend.auth.database import get_db
from saas_backend.auth.models import AnimeStatus, User, Watchlist, WatchlistToAnime


def on_startup():
    connection = next(get_db())

    admin_user = connection.query(User).filter(User.username == "admin").first()  # type: ignore

    if not admin_user:
        admin_user = User(
            id=999,
            username="admin",
            email="admin@admin.com",
            hashed_password=hashlib.sha256("admin".encode()).hexdigest(),
        )

    connection.add(admin_user)

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
    else:
        anime_to_watchlist.status = AnimeStatus.WATCHING  # type: ignore

    connection.add(watchlist)
    connection.add(anime_to_watchlist)

    connection.commit()
    connection.close()
