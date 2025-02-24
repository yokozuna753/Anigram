from app.models import db, environment, SCHEMA
from app.models.anime import Anime
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_anime():
    attack_on_titan = Anime(
        watchlist_id=1, likes=0,title="Attack on Titan", image_url="https://cdn.myanimelist.net/images/anime/10/47347l.jpg",rating=8.55)
    jujutsu_kaisen = Anime(
        watchlist_id=1, likes=0,title="Jujutsu Kaisen", image_url="https://cdn.myanimelist.net/images/anime/1171/109222l.jpg",rating=8.56)
    demon_slayer = Anime(
        watchlist_id=1, likes=0,title="Demon Slayer: Kimetsu no Yaiba", image_url="https://cdn.myanimelist.net/images/anime/1286/99889l.jpg",rating=8.44)
    

    db.session.add(attack_on_titan)
    db.session.add(jujutsu_kaisen)
    db.session.add(demon_slayer)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_anime():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.anime RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM anime"))
        
    db.session.commit()
