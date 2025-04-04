import requests
from flask import Blueprint, jsonify
from app.models import User, Follow, Watchlist
from app.models.user_anime import UserAnime
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

    all_watchlists = Watchlist.query.all()

    final_anime_dict = {}

    # loop through all the watchlists
    for watchlist in all_watchlists:
        # if the watchlist belongs to one of the users the curr user follows
        if watchlist.user_id in user_is_following:

            # and that watchlist has anime in it
            if watchlist.anime:
                # loop through the list of anime
                for anime in watchlist.anime:
                    # populate the anime dict with necessary info on anime
                    # key: anime title, val: anime dict
                    final_anime_dict[anime.title] = {
                        "id": anime.id,
                        "mal_id": anime.mal_id,
                        "image_url": anime.image_url,
                        "likes": anime.likes,
                        "title": anime.title,
                        "users": {},
                    }

    # grab the UserAnime

    for anime_title in final_anime_dict:
        print('ANIME TITLE: ', anime_title)

    users_liked_anime = UserAnime.query.filter(
        UserAnime.anime_id.in_(final_anime_dict)
    ).all()



    for user_anime in users_liked_anime:

        # check if the anime id is in the final anime dict
        if final_anime_dict[user_anime.anime_id]:
            # query for the user that liked the anime
            user = User.query.filter(User.id == user_anime.user_id).first().to_dict()
            # print("USER HERE", user)
            # add the user to the anime's "users" dict
            final_anime_dict[user_anime.anime_id]["users"][user["id"]] = user
        # access the users dict of that anime
        # display all the users that have liked that anime

    return jsonify(final_anime_dict)
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
