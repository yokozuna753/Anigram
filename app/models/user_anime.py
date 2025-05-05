from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.orm import declarative_base
from sqlalchemy import DateTime
from datetime import datetime

# from sqlalchemy.types import DateTime
# from datetime import datetime


class UserAnime(db.Model):
    __tablename__ = "user_anime"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}


    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False
    )
    anime_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("anime.id")), nullable=False
    )

    liked = db.Column(
        db.Boolean,
        default=True,
    )

    user = db.relationship("User", back_populates="user_anime")
    anime = db.relationship("Anime", back_populates="user_anime")


    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "anime_id": self.anime_id,
        }

    # add a users dict which will have the user id (maybe the username as well)
    # key: user_id, val: user dict
    # this will track the users that have this anime in their watchlist
