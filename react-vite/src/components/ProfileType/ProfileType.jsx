import { useNavigate, Navigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector,useDispatch } from "react-redux";
import  UserProfile  from '../UserProfile';
import OtherProfile from "../OtherProfile/OtherProfile";
import { thunkLoadFollows } from "../../redux/follows";
import { thunkLoadAnimeToWatchlists } from "../../redux/watchlist";

/*

1. make Profile Type the parent component which renders child components 

2. user goes to Profile Type route
ROUTE ==> /user/:userId/details
    - use the url params (userId) to check if it matches the session user's id
- MATCHES - render user profile component
- NOT MATCHES - render friends profile component
    - will contain most of the content from the user profile component
        - LIMIT ACCESS TO EDITING, can only view
        -CAN VIEW: friends profile, friends followers/following, friends watchlist with button toggles

        -CAN EDIT - follow button

    ! NOT MATCHES:


    1. check the params for the user Id,
! This is for other user's profile (not the logged in user)
fetch for the user by user id in the search params
//* if the user id in the search params doesnt match the logged in user:
    dispatch a "thunkLoadOtherUser"
    dispatch "thunkLoadFollows"
    dispatch "thunkLoadAnimeToWatchlists"
//* use the use State "isUserSelf" to limit access

load the friends info + "Follow" button

*/

function ProfileType() {
  const user = useSelector((store) => store.session.user);
  const params = useParams();
  const [isUserSelf, setIsUserSelf] = useState(undefined);
  const dispatch = useDispatch();


  useEffect(() => {
    if (user && user.id && Number(params.userId) === user.id) {
      setIsUserSelf(true);
      dispatch(thunkLoadAnimeToWatchlists(user.id));
      dispatch(thunkLoadFollows(user.id));
    } else{
        setIsUserSelf(false);
        // dispatch the other thunks here
    }
  }, [user, params.userId, dispatch]);

  return (
    <>
  <h1>Profile</h1>
    {isUserSelf ?
        <UserProfile />
        :
        <OtherProfile />
    }
    </>
);
}

export default ProfileType;
