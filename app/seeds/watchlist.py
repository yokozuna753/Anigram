from app.models import db, environment, SCHEMA
from app.models.watchlist import Watchlist
from sqlalchemy.sql import text
import datetime


# Adds a demo user, you can add other users here if you want
def seed_watchlists():
    plan_to_watch = Watchlist(
        user_id=1, name="Plan to Watch",created_at=datetime.datetime.now(datetime.timezone.utc), updated_at=datetime.datetime.now(datetime.timezone.utc),)
    started = Watchlist(
        user_id=1, name="Started Watching",created_at=datetime.datetime.now(datetime.timezone.utc), updated_at=datetime.datetime.now(datetime.timezone.utc))
    finished = Watchlist(
        user_id=1, name="Finished Watching",created_at=datetime.datetime.now(datetime.timezone.utc), updated_at=datetime.datetime.now(datetime.timezone.utc))
    on_hold = Watchlist(
       user_id=1, name ="On Hold",created_at=datetime.datetime.now(datetime.timezone.utc), updated_at=datetime.datetime.now(datetime.timezone.utc))

    db.session.add(plan_to_watch)
    db.session.add(started)
    db.session.add(finished)
    db.session.add(on_hold)
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
