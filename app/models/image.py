

# create an image db table 

# image db table will have image_url, user_id, id

# * STEPS TO UPLOAD IMAGE

# click "submit"
# FE thunk dispatches backend request with image url 
    # and user id in body 
# backend route sends image url with file name changed to s3 bucket
# ?

from .db import db, environment, SCHEMA, add_prefix_for_prod

class Image(db.Model):
    __tablename__ = 'images'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    image_url = db.Column(db.String(1500), nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False, unique=True)


    user = db.relationship('User', foreign_keys=[user_id], back_populates='image', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'image_url': self.image_url,
        }
