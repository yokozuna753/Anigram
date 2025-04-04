const LOAD_ANIME = "anime/loadAnime";
const POPULATE_ANIME = "anime/populateAnime";

const loadAnime = (payload) => ({
  type: LOAD_ANIME,
  payload,
});
const populateAnime = (payload) => ({
  type: POPULATE_ANIME,
  payload,
});

export const thunkLoadAnime = (anime_data) => async (dispatch) => {
  // console.log("        IN LOAD ANIME THUNK ===> data...", anime_data);

  // First, get the CSRF token from the endpoint
  const tokenResponse = await fetch("/api/auth/csrf-token", {
    credentials: "include", // Important to include credentials
  });

  if (!tokenResponse.ok) {
    return { errors: { message: "Could not fetch CSRF token" } };
  }

  const { csrf_token } = await tokenResponse.json();

  const anime_name = encodeURIComponent(anime_data.title);
  // console.log("ANIME NAME :    ", anime_name);
  const response = await fetch(`/api/anime/${anime_name}/load`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-CSRFToken": csrf_token },
    body: JSON.stringify(anime_data),
  });

  if (response.ok) {
    const data = await response.json();
    // console.log("DATA HERE ==>  ", data);
    // localStorage.setItem(`anime_${data.mal_id}`, JSON.stringify(data));

    await dispatch(loadAnime(data));
    return data;
  }
  return response;
  // } catch (error) {
  //   console.error("Error loading anime:", error);
  // }
};

export const thunkPopulateAnime = () => async (dispatch) => {
  // First, get the CSRF token from the endpoint
  const tokenResponse = await fetch("/api/auth/csrf-token", {
    credentials: "include", // Important to include credentials
  });

  if (!tokenResponse.ok) {
    return { errors: { message: "Could not fetch CSRF token" } };
  }

  const { csrf_token } = await tokenResponse.json();
  const response = await fetch(`/api/anime/load/all`, {
    headers: { "Content-Type": "application/json", "X-CSRFToken": csrf_token },
  });

  if (response.ok) {
    const data = await response.json();
    // console.log("POPULATING  ANIME... ", data);
    dispatch(populateAnime(data));
  }
};

const initialState = {};

function animeReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_ANIME: {
      const animeKey = `anime_${action.payload.mal_id}`;
      return { ...state, [animeKey]: action.payload };
    }
    case POPULATE_ANIME: {
      return { ...state, ...action.payload };
    }
    default:
      return state;
  }
}

export default animeReducer;
