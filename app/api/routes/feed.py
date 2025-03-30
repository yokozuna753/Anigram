import requests
from flask import Blueprint, jsonify
from app.models import User, Follow
from flask_login import login_required

feed_routes = Blueprint("feed", __name__)


@feed_routes.route("/<int:userId>/followed-users/anime")
@login_required
def users_and_anime(userId):
    """
    Query for all of the followed users' anime

    Return the anime and all the users that have that anime in their watchlist
    """

    final_obj = {}
    all_follows = Follow.query.filter(Follow.user_id == userId).all()


    # create a dictionary to store the users the curr user follows
    user_is_following = {}

    # loop through each follow in the array and assign to dict -> key: user_id, val: follow object (
    #                                                                                   with followed user id and username
    #                                                                                )
    for follow in all_follows:
        user_is_following[follow.followed_user_id] = {
            "username": follow.followed_user_username,
            "user_id": follow.followed_user_id,
        }

    all_users = User.query.all()

    print("ALL USERS =======>    :  ", all_users)

    anime_dict = {}

    for user in all_users:
        if user.id in user_is_following:
            for watchlist in user.watchlists: 
                pass

    return jsonify(user_is_following)
    # return {"message": "success reaching feed backend"}


# i have the users
# iterate through each users 2


"""
1. Query for all of the users the current user follows
    - store the username, user_id, and image_url in an object
        - user_id as keys

2. Query for all of the users (to get the anime they have in their watchlist)
    - access each watchlist of the user
    key: anime name, val: anime dict

# I first want to create the anime dicts and add each to the main dict
3. Loop through users
    - loop through each user
        - check if the user's username is in the object of the current users following list
"""
