import {thunkLoadFollows} from '../../redux/follows';
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";


/*

1. make Profile Type the parent component which renders child components 

2. user goes to Profile Type route
!!!!!  ROUTE ==> /user/:userId/details
    - use the url params (userId) to check if it matches the session user's id
- MATCHES - render user profile component
- NOT MATCHES - render friends profile component
    - will contain most of the content from the user profile component
        - LIMIT ACCESS TO EDITING, can only view
        -CAN VIEW: friends profile, friends followers/following, friends watchlist with button toggles

        -CAN EDIT - follow button



*/

function UserFollowing(){
      const dispatch = useDispatch();

    return (
        <>
        <h1>Following</h1>
        </>
    )

}

export default UserFollowing