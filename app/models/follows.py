from .db import db, environment, SCHEMA, add_prefix_for_prod

class Follow(db.Model):
    __tablename__ = 'follows'

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    user_username = db.Column(db.String(100), nullable=False)
    followed_user_username = db.Column(db.String(100), nullable=False)
    followed_user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)

    user = db.relationship('User', foreign_keys=[user_id], back_populates='user_is_following', lazy=True)
    followed_user = db.relationship('User', foreign_keys=[followed_user_id], back_populates='followers', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'user_username': self.user_username,
            'followed_user_id': self.followed_user_id,
            'followed_user_username': self.followed_user_username,
        }
