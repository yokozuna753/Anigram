const LOAD_FOLLOWS = "follows/loadFollows";

const loadFollows = (payload) => ({
  type: LOAD_FOLLOWS,
  payload,
});

export const thunkLoadFollows = (userId) => async (dispatch) => {
  console.log("        IN LOAD FOLLOWS THUNK ===>  ", userId);

    
    const response = await fetch(`/api/follows/${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('DATA HERE FROM FOLLOWS ==>  ', data);

      await dispatch(loadFollows(data));
    }
    return response;
 
};

const initialState = {};

function followsReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_FOLLOWS: {
      return { ...state, ...action.payload };
    }
    default:
      return state;
  }
}

export default followsReducer;
