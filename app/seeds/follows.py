from app.models import db, environment, SCHEMA
from app.models.follows import Follow
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_follows():
    follow1 = Follow(
        user_id=1,user_username='Demo', followed_user_id=2, followed_user_username='marnie')
    follow2 = Follow(
        user_id=2,user_username='marnie', followed_user_id=1,followed_user_username='Demo')
    follow3 = Follow(
        user_id=1,user_username='Demo', followed_user_id=3,followed_user_username='bobbie' )
    follow4 = Follow(
        user_id=3,user_username='bobbie', followed_user_id=2, followed_user_username='marnie')

    db.session.add(follow1)
    db.session.add(follow2)
    db.session.add(follow3)
    db.session.add(follow4)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_follows():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.follows RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM follows"))
        
    db.session.commit()
