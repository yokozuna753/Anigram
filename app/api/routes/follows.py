from flask import Blueprint, jsonify
from flask_login import login_required, current_user
from app.models.follows import Follow

follow = Blueprint('follows', __name__)


@follow.route('/<int:userId>')
@login_required
def follows_list(userId):
    """
    Query for the logged in users follows

    if the current user is matches the user id - return data for that user Id
    """
    print('             CURRENT USER HERE !!!!!!!!        ', current_user.id)
    following = Follow.query.filter(Follow.user_id == int(userId)).all()
    followers = Follow.query.filter(Follow.followed_user_id == int(userId)).all()

    final_obj = {"Following": [follow.to_dict() for follow in following],
                 "Followers": [follower.to_dict() for follower in followers]
                 }


    # print(' FOLLOWS HERE ===>  ', following)

    return (
        final_obj
)

# User goes to friends profile page
# 1. follows object gets loaded for the user in the url params
    # - frontend sends a request to the redux thunk to load the follows object
    # - redux thunk fetches backend data from user follows with the userId
    # - backend sends follows object with "Followers" & "Following" keys
# 2. everytime the user page is rendered (whether current user or other user) 
    # the follows fetch is made to backend
# Add editing logic in frontend using the url params to check for userId