import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { thunkLoadFollows } from "../../redux/follows";
import {
  thunkLoadOtherUser,
  thunkRemoveOtherUser,
} from "../../redux/otherUser";

/*

1. User clicks on followers (whether its the users' or another users' followers)



2. user goes to the User Followers component route
!!!!!    ROUTE ==>       /user/:userId/details            !!!!!!!!

    - use the url params (userId) to check if it matches the session user's id
- MATCHES - render user profile component
- NOT MATCHES - render friends profile component
    - will contain most of the content from the user profile component
        - LIMIT ACCESS TO EDITING, can only view
        -CAN VIEW: friends profile, friends followers/following, friends watchlist with button toggles

        -CAN EDIT - follow button



*/

function UserFollowing() {
  const user = useSelector((store) => store.session.user);
  useSelector((store) => store.otherUser.user);
  const follows = useSelector((store) => store.follows);
  const dispatch = useDispatch();
  const params = useParams();

  console.log("PARAMS FROM FOLLOWERS ->  ", params);

  useEffect(() => {
    if (user && user.id && user.id === Number(params.userId)) {
      dispatch(thunkLoadFollows(user.id));

      dispatch(thunkRemoveOtherUser());
    } else if (user && user.id && user.id !== Number(params.userId)) {
      dispatch(thunkLoadOtherUser(Number(params.userId)));
      dispatch(thunkLoadOtherUser(Number(params.userId)));
      dispatch(thunkLoadFollows(Number(params.userId)));
    }
  }, [params.userId, dispatch, user]);

  return (
    <>
      <h1>Following</h1>
      <div className="followers-container">
        <ul style={{ listStyleType: "none" }}>
          {follows &&
            follows["Following"] &&
            follows["Following"].map((following) => {
              console.log("following:  ", following.followed_user_id);

              return (
                <li key={following.id}>
                  <h2>
                    <a
                      href={`/user/${following.followed_user_id}/details`}
                      style={{ cursor: "pointer" }}
                    >
                      @{following.followed_user_username}
                    </a>
                  </h2>
                </li>
              );
            })}
        </ul>
      </div>
    </>
  );
}

export default UserFollowing;
