import requests
from app.models import db, environment, SCHEMA
from app.models.anime_genre import AnimeGenre
from sqlalchemy import text

JIKAN_GENRE_URL = "https://api.jikan.moe/v4/genres/anime"

def seed_genres():
    response = requests.get(JIKAN_GENRE_URL)
    if response.status_code != 200:
        print("Failed to fetch genres from Jikan API")
        return

    genres = response.json().get("data", [])
    for genre in genres:
        g = AnimeGenre(
            genre_mal_id=genre["mal_id"],
            genre_name=genre["name"]
        )
        db.session.add(g)

    db.session.commit()
    print(f"Seeded {len(genres)} anime genres.")


def undo_genres():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.anime_genres RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM anime_genres"))

    db.session.commit()
