from flask import Blueprint, jsonify
from app.models import User
from flask_login import login_required

feed_routes = Blueprint("feed", __name__)


@feed_routes.route("/followed-users/anime")
@login_required
def users_and_anime():
    """
    Query for all of the followed users' anime

    Return the anime and all the users that have that anime in their watchlist
    """
    all_users = User.query.all()
    # print("          !!!!!!!!    ALL USERS !!!!!!!!:  ",all_users)
    users = {}
    for user in all_users:
        temp_user_array = {}
        temp_user_array["user_id"] = user.id
        temp_user_array["username"] = user.username
        temp_user_array["image_url"] = user.profile_pic_url
        users[f"user_{user.id}"] = temp_user_array
        # user_array.append(user.to_dict())
        # print("          !!!!!!!!    ALL USERS !!!!!!!!:  ",user.to_dict())
        break
    return jsonify(users)
    # return {"message": "success reaching feed backend"}
