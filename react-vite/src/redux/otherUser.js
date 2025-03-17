const SET_OTHER_USER = "otherUser/setOtherUser";
const REMOVE_OTHER_USER = "otherUser/removeOtherUser";

const setOtherUser = (user) => ({
  type: SET_OTHER_USER,
  payload: user,
});

const removeOtherUser = () => ({
  type: REMOVE_OTHER_USER,
});

export const thunkLoadOtherUser = (userId) => async (dispatch) => {
  // console.log('OTHER USER ID ==>  ', userId);
  // First, get the CSRF token from the endpoint
  const tokenResponse = await fetch("/api/auth/csrf-token", {
    credentials: "include", // Important to include credentials
  });

  if (!tokenResponse.ok) {
    return { errors: { message: "Could not fetch CSRF token" } };
  }

  const { csrf_token } = await tokenResponse.json();
  const response = await fetch(`/api/users/${userId}`, {
    headers: { "Content-Type": "application/json", "X-CSRFToken": csrf_token },
  });

  if (response.ok) {
    // console.log('RESPONSE FOR OTHER USER THUNK ==>   ', response);
    const data = await response.json();
    // console.log('RESPONSE FROM OTHER USER THUNK => ', data);
    if (data.errors) {
      return data.errors;
    }

    dispatch(setOtherUser(data));
  }
};

export const thunkRemoveOtherUser = () => async (dispatch) => {
  dispatch(removeOtherUser());
};

const initialState = { user: null };

function otherUserReducer(state = initialState, action) {
  switch (action.type) {
    case SET_OTHER_USER: {
      const newState = { ...state, user: action.payload };
      // console.log("New state:", newState);
      return newState;
    }
    case REMOVE_OTHER_USER:
      return { ...state, user: null };
    default:
      return state;
  }
}

export default otherUserReducer;
