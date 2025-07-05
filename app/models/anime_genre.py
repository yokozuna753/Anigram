from .db import db, environment, SCHEMA

class AnimeGenre(db.Model):
    __tablename__ = 'anime_genres'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)  
    genre_mal_id = db.Column(db.Integer, nullable=False) # mal_id from Jikan
    genre_name = db.Column(db.String, nullable=False)

    def to_dict(self):
        return {
            "genre_mal_id": self.genre_mal_id,
            "genre_name": self.genre_name,
        }
