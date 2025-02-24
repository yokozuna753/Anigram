from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.types import DateTime
from datetime import datetime


class Anime(db.Model):
    __tablename__ = 'anime'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    watchlist_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("watchlists.id")), nullable=False)
    likes = db.Column(db.Integer, nullable=False, default=0)
    title = db.Column(db.String(200), nullable=False)
    image_url = db.Column(db.String(300), nullable=False)
    rating = db.Column(db.Float, nullable=False, default=0.0)

    watchlist = db.relationship('Watchlist', back_populates='anime')


    def to_dict(self):
        return {
            'id': self.id,
            'watchlist_id': self.watchlist_id,
            'likes': self.likes,
            'title': self.title,
            'image_url': self.image_url,
            'rating': self.rating,
        }
