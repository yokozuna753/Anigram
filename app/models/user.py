from .db import db, environment, SCHEMA
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin


class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(255), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)
    profile_pic_url = db.Column(db.String(1000), nullable=True)

    # Relationship to "following" (users that the user is following)
    user_is_following = db.relationship(
        'Follow',
        foreign_keys='Follow.user_id',  # Specify which foreign key to use
        back_populates='user',
    )

    # Relationship to "followers" (users that are following the user)
    followers = db.relationship(
        'Follow',
        foreign_keys='Follow.followed_user_id',  # Specify which foreign key to use
        back_populates='followed_user',
    )

    watchlists = db.relationship("Watchlist", back_populates="user", cascade="all, delete-orphan")

    @property
    def password(self):
        return self.hashed_password

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'profile_pic_url': self.profile_pic_url,
            'watchlists': [item.to_dict() for item in self.watchlists],
            'followers': [follower.to_dict() for follower in self.followers],
            'user_is_following': [followed_user.to_dict() for followed_user in self.user_is_following]
        }
