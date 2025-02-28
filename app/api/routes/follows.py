from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models.follows import Follow
from app.models import db

follow = Blueprint('follows', __name__)


@follow.route('/<int:userId>')
@login_required
def follows_list(userId):
    """
    Query for the users follows by ID

    if the current user is matches the user id - return data for that user Id
    """

    following = Follow.query.filter(Follow.user_id == int(userId)).all()
    followers = Follow.query.filter(Follow.followed_user_id == int(userId)).all()

    final_obj = {"Following": [follow.to_dict() for follow in following],
                 "Followers": [follower.to_dict() for follower in followers]
                 }


    # print(' FOLLOWS HERE ===>  ', following)

    return (
        final_obj
)





@follow.route('/<int:userId>/<int:otherUserId>/follow', methods=['POST'])
@login_required
def follow_other_user(userId,otherUserId):
    # * query the db for the user following otherUser

    request_data = request.get_json()
    print('THIS IS REQUEST DATA ===>  ', request_data)
    foundFollow = Follow.query.filter(Follow.user_id == userId, Follow.followed_user_id == otherUserId).first()
    # print('DID WE FIND THE FOLLOW?')
    # print('          !!!!!!!!!  ', foundFollow)

    if not foundFollow:
        # new_follow = Follow(
        #     user_id=1,user_username='Demo', followed_user_id=2, followed_user_username='marnie'
        # )
        pass
    return jsonify({'message': "response from FOLLOW backend"})




@follow.route('/<int:userId>/<int:otherUserId>/unfollow', methods=['DELETE'])
@login_required
def unfollow_other_user(userId,otherUserId):


    return jsonify({'message': "response from UNFOLLOW backend"})
# User goes to friends/own profile page
# 1. follows object gets loaded for the user in the url params
    # - frontend sends a request to the redux thunk to load the follows object
    # - redux thunk fetches backend data from user follows with the userId
    # - backend sends follows object with "Followers" & "Following" keys
# 2. everytime the user page is rendered (whether current user or other user) 
    # the follows fetch is made to backend
# Add editing logic in frontend using the url params to check for userId