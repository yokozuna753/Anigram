from app.models import db, environment, SCHEMA
from app.models.watchlist import Watchlist
from sqlalchemy.sql import text
import datetime


# Adds a demo user, you can add other users here if you want
def seed_watchlists():
    plan_to_watch1 = Watchlist(
        user_id=1, name="Plan to Watch",created_at=datetime.datetime.now(datetime.timezone.utc), updated_at=datetime.datetime.now(datetime.timezone.utc),)
    started1 = Watchlist(
        user_id=1, name="Started Watching",created_at=datetime.datetime.now(datetime.timezone.utc), updated_at=datetime.datetime.now(datetime.timezone.utc))
    finished1 = Watchlist(
        user_id=1, name="Finished Watching",created_at=datetime.datetime.now(datetime.timezone.utc), updated_at=datetime.datetime.now(datetime.timezone.utc))
    on_hold1 = Watchlist(
       user_id=1, name ="On Hold",created_at=datetime.datetime.now(datetime.timezone.utc), updated_at=datetime.datetime.now(datetime.timezone.utc))
    plan_to_watch2 = Watchlist(
        user_id=2, name="Plan to Watch",created_at=datetime.datetime.now(datetime.timezone.utc), updated_at=datetime.datetime.now(datetime.timezone.utc),)
    started2 = Watchlist(
        user_id=2, name="Started Watching",created_at=datetime.datetime.now(datetime.timezone.utc), updated_at=datetime.datetime.now(datetime.timezone.utc))
    finished2 = Watchlist(
        user_id=2, name="Finished Watching",created_at=datetime.datetime.now(datetime.timezone.utc), updated_at=datetime.datetime.now(datetime.timezone.utc))
    on_hold2 = Watchlist(
       user_id=2, name ="On Hold",created_at=datetime.datetime.now(datetime.timezone.utc), updated_at=datetime.datetime.now(datetime.timezone.utc))
    plan_to_watch3 = Watchlist(
        user_id=3, name="Plan to Watch",created_at=datetime.datetime.now(datetime.timezone.utc), updated_at=datetime.datetime.now(datetime.timezone.utc),)
    started3 = Watchlist(
        user_id=3, name="Started Watching",created_at=datetime.datetime.now(datetime.timezone.utc), updated_at=datetime.datetime.now(datetime.timezone.utc))
    finished3 = Watchlist(
        user_id=3, name="Finished Watching",created_at=datetime.datetime.now(datetime.timezone.utc), updated_at=datetime.datetime.now(datetime.timezone.utc))
    on_hold3 = Watchlist(
       user_id=3, name ="On Hold",created_at=datetime.datetime.now(datetime.timezone.utc), updated_at=datetime.datetime.now(datetime.timezone.utc))

    db.session.add(plan_to_watch1)
    db.session.add(started1)
    db.session.add(finished1)
    db.session.add(on_hold1)
    db.session.add(plan_to_watch2)
    db.session.add(started2)
    db.session.add(finished2)
    db.session.add(on_hold2)
    db.session.add(plan_to_watch3)
    db.session.add(started3)
    db.session.add(finished3)
    db.session.add(on_hold3)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_watchlists():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.watchlists RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM watchlists"))
        
    db.session.commit()
