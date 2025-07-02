from .db import db, environment, SCHEMA, add_prefix_for_prod

class AnimeGenre(db.Model):
    __tablename__ = 'anime_genres'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)  # mal_id from Jikan
    name = db.Column(db.String, nullable=False)
    url = db.Column(db.String)
