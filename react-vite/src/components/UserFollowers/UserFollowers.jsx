import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {thunkLoadFollows} from '../../redux/follows'



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

function UserFollowers(){
    
    const user = useSelector((store) => store.session.user);
    const follows = useSelector((store)=> store.follows)
    const [isUserSelf, setIsUserSelf] = useState(true);
      const dispatch = useDispatch();
    
    const params = useParams();


        useEffect(() => {
          if(user && user.id){
            console.log('PARAMS FROM FOLLOWERS ->  ', params);
            if (Number(params.userId) == user.id){
                setIsUserSelf(true);
            }
            dispatch(thunkLoadFollows(user.id))
          }
        }, [dispatch, user])

    return (
        <>
        <h1>Followers</h1>
        <div className="followers-container">
            <ul>
                {follows && follows['Followers'] && follows['Followers']
                .map((follower)=> <li>{follower.user_id}</li>)}
            </ul>

        </div>
        </>
    )

}

export default UserFollowers