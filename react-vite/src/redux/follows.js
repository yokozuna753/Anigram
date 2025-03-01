const LOAD_FOLLOWS = "follows/loadFollows";
const FOLLOW_OTHER_USER = "follows/followOtherUser"
const UNFOLLOW_OTHER_USER = "follows/unfollowOtherUser"

const loadFollows = (payload) => ({
  type: LOAD_FOLLOWS,
  payload,
});
const followOtherUserAction = (payload) => ({
  type: FOLLOW_OTHER_USER,
  payload,
});
const unfollowOtherUserAction = (payload) => ({
  type: UNFOLLOW_OTHER_USER,
  payload,
});

export const thunkLoadFollows = (userId) => async (dispatch) => {
  // console.log("        IN LOAD FOLLOWS THUNK ===>  ", userId);

    
    const response = await fetch(`/api/follows/${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      const data = await response.json();
      // console.log('DATA HERE FROM FOLLOWS ==>  ', data);

      await dispatch(loadFollows(data));
    }
    return response;
 
};
export const thunkFollowOtherUser = (userId, mainUserUsername, otherUserId,otherUserUsername) => async (dispatch) => {
console.log('IN FOLLOW OTHER USER THUNK ==>');
// ** GOAL: return the follows for the Other User after the main user follows them
// ! ONLY WANT TO RETURN THE FOLLOWERS STATE TO UPDATE FOR THE OTHER USER
const response = await fetch(`/api/follows/${userId}/${otherUserId}/follow`, {
  method: 'POST',
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    mainUserUsername,
    otherUserUsername
  })
})
const data = await response.json();
if(data.errors){
  return data.errors
}

if(response.ok){
  console.log('FOLLOW DATA THUNK ==>    ', data);
  dispatch(followOtherUserAction(data))
}
return response;
};


export const thunkUnfollowOtherUser = (userId, mainUserUsername, otherUserId,otherUserUsername) => async (dispatch) => {
  console.log(' IN UNFOLLOW OTHER USER THUNK ==>');
  // ** GOAL: return the follows for the Other User after the main user unfollows them
  // ! ONLY WANT TO RETURN THE FOLLOWERS STATE TO UPDATE FOR THE OTHER USER
  const response = await fetch(`/api/follows/${userId}/${otherUserId}/unfollow`, {
    method: 'DELETE',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mainUserUsername,
      otherUserUsername
    })
  })
  
  const data = await response.json();
  if(data.errors){
    return data.errors
  }

  if(response.ok){
    console.log('UNFOLLOW DATA THUNK ==>    ', data);
    dispatch(unfollowOtherUserAction(data));
  }

  return response
};



const initialState = {};

function followsReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_FOLLOWS: {
      return { ...state, ...action.payload };
    }
    case FOLLOW_OTHER_USER: {
      return { ...state, ...action.payload };
    }
    case UNFOLLOW_OTHER_USER: {
      return { ...state, ...action.payload };
    }
    default:
      return state;
  }
}

export default followsReducer;
