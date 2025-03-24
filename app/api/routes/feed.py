import requests
from flask import Blueprint, jsonify
from app.models import Follow
from flask_login import login_required

feed_routes = Blueprint("feed", __name__)


@feed_routes.route("/<int:userId>/followed-users/anime")
@login_required
def users_and_anime(userId):
    """
    Query for all of the followed users' anime

    Return the anime and all the users that have that anime in their watchlist
    """
    # print('        !!!!!!!!!     USER ID HERE !!!!!!! : ', userId)
    all_users = Follow.query.filter(Follow.user_id == userId).all()
    print("          !!!!!!!!    ALL USERS !!!!!!!!:  ",all_users)
    users = {}
    for follow in all_users:
        temp_user_array = {}
        temp_user_array["user_id"] = follow.followed_user_id
        temp_user_array["username"] = follow.followed_user_username
        # temp_user_array["image_url"] = follow.profile_pic_url => Leaving this out for now 
        users[f"user_{follow.id}"] = temp_user_array
        print("          !!!!!!!!    ALL USERS !!!!!!!!:  ",follow.to_dict())

    return jsonify(users)
    # return {"message": "success reaching feed backend"}
