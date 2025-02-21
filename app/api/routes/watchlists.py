from flask import Blueprint, jsonify
from flask_login import login_required
from app.models.follows import Follow

watchlists = Blueprint('watchlists', __name__)


@watchlists.route('/<int:watchlistId>/<string:animeName>')
@login_required
def follows_list(userId):
    """
    Query for the logged in users follows
    """
    followers = Follow.query.filter(Follow.user_id == int(userId)).all()

    return jsonify([follower.to_dict() for follower in followers]
)



# /api/watchlists/1