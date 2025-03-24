const POPULATE_USERS = "feed/populateUsers";

const populateUsers = (payload) => {
    return {
        type: POPULATE_USERS,
        payload
    }
}

export const thunkPopulateUsers = (userId) => async (dispatch) => {
     // First, get the CSRF token from the endpoint
  const tokenResponse = await fetch("/api/auth/csrf-token", {
    credentials: "include", // Important to include credentials
  });

  if (!tokenResponse.ok) {
    return { errors: { message: "Could not fetch CSRF token" } };
  }

  const { csrf_token } = await tokenResponse.json();
  
  const response = await fetch(`/api/feed/${userId}/followed-users/anime`, {
    headers: { "Content-Type": "application/json", "X-CSRFToken": csrf_token },
  });

  
  if(response.ok){
      const data = await response.json();
      console.log('RESPONSE FROM POP USERS: ',  data);
      dispatch(populateUsers(data))
  }
};

const initialState = { user: null };

function feedReducer(state = initialState, action) {
  switch (action.type) {
    case POPULATE_USERS: {
      return {...state, ...action.payload};
    }
    default:
      return state;
  }
}

export default feedReducer;
