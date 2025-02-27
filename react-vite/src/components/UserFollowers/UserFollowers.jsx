

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

    return (
        <>
        <h1>Followers</h1>
        </>
    )

}

export default UserFollowers