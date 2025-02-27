import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";


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
    const [isUserSelf, setIsUserSelf] = useState(true);
    
    const params = useParams();


        useEffect(() => {
          if(user && user.id){
            console.log('PARAMS FROM FOLLOWERS ->  ', params);
            if (Number(params.userId) == user.id){
                setIsUserSelf(true);
            }
          }
        }, [user])

    return (
        <>
        <h1>Followers</h1>
        </>
    )

}

export default UserFollowers