from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.types import DateTime
import datetime


class Watchlist(db.Model):
    __tablename__ = 'watchlists'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    created_at = db.Column(DateTime, default=datetime.timezone.utc)
    updated_at = db.Column(DateTime, onupdate=datetime.timezone.utc, default=datetime.timezone.utc)

    user = db.relationship("User", back_populates="watchlists",cascade='save-update')
    anime = db.relationship("Anime", back_populates="watchlist")

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'anime': [item.to_dict() for item in self.anime]      
        }
