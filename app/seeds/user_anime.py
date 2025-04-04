from app.models import db, User, environment, SCHEMA, Anime
from app.models.user_anime import UserAnime
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_user_anime():
    demo = User.query.filter_by(username="Demo").first()
    marnie = User.query.filter_by(username="marnie").first()
    bobbie = User.query.filter_by(username="bobbie").first()

    if not demo:
        print("Demo user not found! Make sure to seed users first.")
        return

    anime1 = Anime.query.filter_by(title="Attack on Titan").first()
    anime2 = Anime.query.filter_by(title="Demon Slayer: Kimetsu no Yaiba").first()
    anime3 = Anime.query.filter_by(title="One Piece").first()

    if not all([anime1, anime2, anime3]):
        print("Some anime titles are missing! Make sure to seed anime first.")
        return

    ua1 = UserAnime(user_id=demo.id, anime_id=anime1.id)
    ua2 = UserAnime(user_id=demo.id, anime_id=anime2.id)
    ua3 = UserAnime(user_id=demo.id, anime_id=anime3.id)

    ua4 = UserAnime(user_id=marnie.id, anime_id=anime1.id)
    ua5 = UserAnime(user_id=marnie.id, anime_id=anime2.id)
    ua6 = UserAnime(user_id=marnie.id, anime_id=anime3.id)

    ua7 = UserAnime(user_id=bobbie.id, anime_id=anime1.id)
    ua8 = UserAnime(user_id=bobbie.id, anime_id=anime2.id)
    ua9 = UserAnime(user_id=bobbie.id, anime_id=anime3.id)

    db.session.add(ua1)
    db.session.add(ua2)
    db.session.add(ua3)
    db.session.add(ua4)
    db.session.add(ua5)
    db.session.add(ua6)
    db.session.add(ua7)
    db.session.add(ua8)
    db.session.add(ua9)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_user_anime():
    if environment == "production":
        db.session.execute(
            f"TRUNCATE table {SCHEMA}.user_anime RESTART IDENTITY CASCADE;"
        )
    else:
        db.session.execute(text("DELETE FROM user_anime"))

    db.session.commit()
