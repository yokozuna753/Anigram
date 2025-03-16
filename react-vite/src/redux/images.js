const LOAD_IMAGES = "images/loadImages";

const loadImages = (payload) => ({
  type: LOAD_IMAGES,
  payload,
});

export const thunkLoadImages = (image_request_data) => async (dispatch) => {
  console.log("        IN LOAD IMAGES THUNK ===>  ", image_request_data);

  // First, get the CSRF token from the endpoint
  const tokenResponse = await fetch("/api/auth/csrf-token", {
    credentials: "include", // Important to include credentials
  });

  if (!tokenResponse.ok) {
    return { errors: { message: "Could not fetch CSRF token" } };
  }

  const { csrf_token } = await tokenResponse.json();

  const response = await fetch(`/api/images/profile-pic/update`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-CSRFToken": csrf_token },
    body: JSON.stringify(image_request_data),
  });

  if (response.ok) {
    const data = await response.json();
    console.log("DATA HERE ==>  ", data);

    // await dispatch(loadImages(data));
    // return data;
  }
  return response;
};

const initialState = {};

function imagesReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_IMAGES: {
    console.log('IN LOAD IMAGES REDUCER !!!!');
    //   return { ...state, [animeKey]: action.payload };
    }
    default:
      return state;
  }
}

export default imagesReducer;
