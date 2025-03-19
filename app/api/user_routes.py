import requests
from app.models import User
from flask import Blueprint, jsonify
from flask_login import login_required

user_routes = Blueprint("users", __name__)


@user_routes.route("/")
@login_required
def users():
    """
    Query for all users and returns them in a list of user dictionaries
    """
    users = User.query.all()
    return {"users": [user.to_dict() for user in users]}


@user_routes.route("/<int:id>")
@login_required
def user(id):
    """
    Query for a user by id and returns that user in a dictionary

    - query for the user by id
    - iterate through the user's watchlists
    - on each, iterate through each anime
    - query for the for the anime and attach the "data" to each
    """
    user = User.query.get(id)
    # for watchlist in user.watchlists:
    #     for a in watchlist.anime:
    #         # print('          ANIME    ==>', a.title)
    #         r = requests.get(f'https://api.jikan.moe/v4/anime?q={a.title}')
    #         # print(r)
    #         a.image_url = r.json()['data'][0]['images']['jpg']['image_url']
    return user.to_dict()
