from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.orm import declarative_base
from sqlalchemy import DateTime
from datetime import datetime

# from sqlalchemy.types import DateTime
# from datetime import datetime


class UserAnime(db.Model):
    __tablename__ = "user_anime"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False
    )
    anime_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("anime.id")), nullable=False
    )
    

    user = db.relationship("User", back_populates="user_anime")
    anime = db.relationship("Anime", back_populates="user_anime")


def to_dict(self):
    return {
        "id": self.id,
        "mal_id": self.mal_id,
        "watchlist_id": self.watchlist_id,
        "likes": self.likes,
        "title": self.title,
        "image_url": self.image_url,
        "producers": self.producers,
        "rating": self.rating,
        "trailer_url": self.trailer_url,
        "mal_url": self.mal_url,
        "synopsis": self.synopsis,
    }

    # add a users dict which will have the user id (maybe the username as well)
    # key: user_id, val: user dict
    # this will track the users that have this anime in their watchlist
