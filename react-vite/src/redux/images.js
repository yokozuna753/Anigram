const UPLOAD_IMAGES = "images/uploadImages";
const LOAD_IMAGES = "images/loadImages";
const REMOVE_IMAGES = "images/removeImages";

const loadImages = (payload) => ({
  type: LOAD_IMAGES,
  payload,
});

const uploadImages = (payload) => ({
  type: UPLOAD_IMAGES,
  payload,
});

const removeImages = (userId) => ({
  type: REMOVE_IMAGES,
  payload: userId,
});

export const thunkLoadImages = () => async (dispatch) => {
  // First, get the CSRF token from the endpoint
  const tokenResponse = await fetch("/api/auth/csrf-token", {
    credentials: "include", // Important to include credentials
  });

  if (!tokenResponse.ok) {
    return { errors: { message: "Could not fetch CSRF token" } };
  }

  const { csrf_token } = await tokenResponse.json();

  const response = await fetch(`/api/images/load/all`, {
    headers: { "X-CSRFToken": csrf_token },
  });

  if (response.ok) {
    const data = await response.json();
    // console.log(" !!!!!!!    DATA - LOAD IMAGES: ", data);
    await dispatch(loadImages(data));
    return data;
  }
  return response;
};

export const thunkUploadImages =
  (userId, image_request_data) => async (dispatch) => {
    // console.log("        IN LOAD IMAGES THUNK ===>  ", image_request_data);

    // First, get the CSRF token from the endpoint
    const tokenResponse = await fetch("/api/auth/csrf-token", {
      credentials: "include", // Important to include credentials
    });

    if (!tokenResponse.ok) {
      return { errors: { message: "Could not fetch CSRF token" } };
    }

    const { csrf_token } = await tokenResponse.json();

    const formData = new FormData();
    formData.append("image", image_request_data);
    // for (let pair of formData.entries()) {
      // console.log(pair[0] + ": " + pair[1]);
    // }

    const response = await fetch(`/api/images/${userId}/profile-pic/update`, {
      method: "POST",
      headers: { "X-CSRFToken": csrf_token },
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      // console.log("DATA HERE ==>  ", data);

      await dispatch(uploadImages(data));
      return data;
    }
    return response;
  };

export const thunkDeleteImage = (userId) => async (dispatch) => {
  // First, get the CSRF token from the endpoint
  const tokenResponse = await fetch("/api/auth/csrf-token", {
    credentials: "include", // Important to include credentials
  });

  if (!tokenResponse.ok) {
    return { errors: { message: "Could not fetch CSRF token" } };
  }

  const { csrf_token } = await tokenResponse.json();

  const response = await fetch(`/api/images/${userId}/profile-pic/remove`, {
    method: "DELETE",
    headers: { "X-CSRFToken": csrf_token },
  });

  if (response.ok) {
    try {
      const data = await response.json();
      // console.log("DATA => ", data);
      dispatch(removeImages(userId));
      return data;
    } catch (e) {
      console.error("Failed to parse JSON response:", e);
      return { errors: { message: "Invalid response format" } };
    }
  } else {
    console.error("Error status:", response.status);
    return { errors: { message: "Request failed" } };
  }
};

const initialState = {};

function imagesReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_IMAGES: {
      // console.log("LOAD IMAGES REDUCER PAYLOAD =>", action.payload);
      return {...state, ...action.payload};
    }
    case UPLOAD_IMAGES: {
      return { ...state, [`user_${action.payload.user_id}`]: action.payload };
    }
    case REMOVE_IMAGES: {
      // Create a copy of state
      const newState = { ...state };
      // Delete the user's images using the correct property name
      delete newState[`user_${action.payload}`];
      // console.log("STATE AFTER REMOVE IMAGE:", newState);
      return newState;
    }
    default:
      return state;
  }
}

export default imagesReducer;
