from app.models import db
from app.models.follows import Follow
from flask import Blueprint, jsonify, request
from flask_login import current_user, login_required

follow = Blueprint("follows", __name__)


@follow.route("/<int:userId>")
@login_required
def follows_list(userId):
    """
    Query for the users follows by ID

    if the current user is matches the user id - return data for that user Id
    """

    following = Follow.query.filter(Follow.user_id == int(userId)).all()
    followers = Follow.query.filter(Follow.followed_user_id == int(userId)).all()

    final_obj = {
        "Following": [follow.to_dict() for follow in following],
        "Followers": [follower.to_dict() for follower in followers],
    }

    # print(' FOLLOWS HERE ===>  ', following)

    return final_obj


@follow.route("/<int:userId>/<int:otherUserId>/follow", methods=["POST"])
@login_required
def follow_other_user(userId, otherUserId):
    # * query the db for the user following otherUser

    request_data = request.get_json()
    # print('THIS IS REQUEST DATA ===>  ', request_data)
    foundFollow = Follow.query.filter(
        Follow.user_id == userId, Follow.followed_user_id == otherUserId
    ).first()
    # print('DID WE FIND THE FOLLOW?')
    # print('          !!!!!!!!!  ', foundFollow)

    if not foundFollow:
        new_follow = Follow(
            user_id=userId,
            user_username=request_data["mainUserUsername"],
            followed_user_id=otherUserId,
            followed_user_username=request_data["otherUserUsername"],
        )

        # print('            !!!!!!!!!!! NEW FOLLOW ===>   ', new_follow.user_id, new_follow.followed_user_id)

        db.session.add(new_follow)
        db.session.commit()
        following = Follow.query.filter(Follow.user_id == int(otherUserId)).all()
        followers = Follow.query.filter(
            Follow.followed_user_id == int(otherUserId)
        ).all()

        final_obj = {
            "Following": [follow.to_dict() for follow in following],
            "Followers": [follower.to_dict() for follower in followers],
        }

        return final_obj
    return jsonify({"errors": "User not found"})


@follow.route("/<int:userId>/<int:otherUserId>/unfollow", methods=["DELETE"])
@login_required
def unfollow_other_user(userId, otherUserId):
    """
    Query for the follow row in the db, unfollow the other user,
    and return the updated other user's follows
    """
    request_data = request.get_json()
    print("THIS IS REQUEST DATA ===>  ", request_data)
    found_follow = Follow.query.filter(
        Follow.user_id == userId, Follow.followed_user_id == otherUserId
    ).first()
    # print('DID WE FIND THE FOLLOW?')
    # print('          !!!!!!!!!  ', found_follow)

    if found_follow:
        db.session.delete(found_follow)
        db.session.commit()

        following = Follow.query.filter(Follow.user_id == int(otherUserId)).all()
        followers = Follow.query.filter(
            Follow.followed_user_id == int(otherUserId)
        ).all()

        final_obj = {
            "Following": [follow.to_dict() for follow in following],
            "Followers": [follower.to_dict() for follower in followers],
        }

        return final_obj

    return jsonify({"errors": "User not found"})


# User goes to friends/own profile page
# 1. follows object gets loaded for the user in the url params
# - frontend sends a request to the redux thunk to load the follows object
# - redux thunk fetches backend data from user follows with the userId
# - backend sends follows object with "Followers" & "Following" keys
# 2. everytime the user page is rendered (whether current user or other user)
# the follows fetch is made to backend
# Add editing logic in frontend using the url params to check for userId
