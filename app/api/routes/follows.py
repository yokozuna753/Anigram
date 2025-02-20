from flask import Blueprint, jsonify
from flask_login import login_required, current_user
from app.models.follows import Follow

follow = Blueprint('follows', __name__)


@follow.route('/<int:userId>')
@login_required
def follows_list(userId):
    """
    Query for the logged in users follows
    """
    followers = Follow.query.filter(Follow.user_id == int(userId)).all()

    return jsonify([follower.to_dict() for follower in followers]
)