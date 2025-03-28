from .db import db, environment, SCHEMA, add_prefix_for_prod
# from sqlalchemy.types import DateTime
# from datetime import datetime


class Anime(db.Model):
    __tablename__ = 'anime'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    mal_id = db.Column(db.Integer, nullable=False)
    watchlist_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("watchlists.id")), nullable=True)
    likes = db.Column(db.Integer, nullable=False, default=0)
    title = db.Column(db.String(200), nullable=False)
    image_url = db.Column(db.String(300), nullable=False)
    producers = db.Column(db.String(500), nullable=True)
    rating = db.Column(db.String(300), nullable=True,)
    trailer_url = db.Column(db.String(300), nullable=True)
    mal_url = db.Column(db.String(300), nullable=False)
    synopsis = db.Column(db.String(7000), nullable=True)

    watchlist = db.relationship('Watchlist', back_populates='anime')


    def to_dict(self):
        return {
            'id': self.id,
            'mal_id': self.mal_id,
            'watchlist_id': self.watchlist_id,
            'likes': self.likes,
            'title': self.title,
            'image_url': self.image_url,
            'producers': self.producers,
            'rating': self.rating,
            'trailer_url':self.trailer_url,
            'mal_url': self.mal_url,
            'synopsis':self.synopsis,
        }
    
    # add a users dict which will have the user id (maybe the username as well)
        # key: user_id, val: user dict
    # this will track the users that have this anime in their watchlist
