const ADD_ANIME = "watchlists/addAnime";
const REMOVE_ANIME = "watchlists/removeAnime";
const LOAD_ANIME = "watchlists/loadWatchlists";
const MOVE_ANIME = "watchlists/moveAnimeToOtherWatchlist";

const addAnimeToWatchlist = (payload) => ({
  type: ADD_ANIME,
  payload,
});


const updateWatchlists = (payload) => ({
  type: REMOVE_ANIME,
  payload,
});


const loadWatchlists = (payload) => ({
  type: LOAD_ANIME,
  payload,
});


const moveAnimeToOtherWatchlist = (payload) => ({
  type: MOVE_ANIME,
  payload,
});


export const thunkMoveAnimeToOtherWatchlist = 
(userId, watchlistIdRemoveAnime, watchlistIdAddAnime, anime_obj) => async (dispatch) => {
  
  // First, get the CSRF token from the endpoint
  const tokenResponse = await fetch("/api/auth/csrf-token", {
    credentials: "include", // Important to include credentials
  });

  if (!tokenResponse.ok) {
    return { errors: { message: "Could not fetch CSRF token" } };
  }

  const { csrf_token } = await tokenResponse.json();

  const response = await fetch(
    `/api/watchlists/${userId}/${watchlistIdRemoveAnime}/${watchlistIdAddAnime}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrf_token,
      },
      body: JSON.stringify(anime_obj),
    }
  );

  if (response.ok) {
    const data = await response.json();

    console.log('Move Anime Thunk data => ', data);

    if (data.error) {
      return data.error;
    }

    await dispatch(moveAnimeToOtherWatchlist(data));
  }
  return response;
}


export const thunkAddAnimeToWatchlist =
  (userId, watchlistId, anime_obj) => async (dispatch) => {

    // add the anime to the watchlist
    // First, get the CSRF token from the endpoint
    const tokenResponse = await fetch("/api/auth/csrf-token", {
      credentials: "include", // Important to include credentials
    });

    if (!tokenResponse.ok) {
      return { errors: { message: "Could not fetch CSRF token" } };
    }

    const { csrf_token } = await tokenResponse.json();
    const response = await fetch(
      `/api/watchlists/${userId}/${watchlistId}/${encodeURIComponent(
        anime_obj.title
      )}/add`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrf_token,
        },
        body: JSON.stringify({
          userId,
          watchlistId,
          anime_obj,
        }),
      }
    );

    // iterate through the data
    // match the anime_obj.title to the watchlist anime.title
    // use that obj and set it with the mal_id to the local storage

    if (response.ok) {
      const data = await response.json();

      if (data.error) {
        return data.error;
      }

      await dispatch(addAnimeToWatchlist(data));
    }
    return response;
  };


export const thunkRemoveAnimeFromWatchlist =
  (userId, watchlistId, animeName) => async (dispatch) => {
    // First, get the CSRF token from the endpoint
    const tokenResponse = await fetch("/api/auth/csrf-token", {
      credentials: "include", // Important to include credentials
    });

    if (!tokenResponse.ok) {
      return { errors: { message: "Could not fetch CSRF token" } };
    }

    const { csrf_token } = await tokenResponse.json();

    const response = await fetch(
      `/api/watchlists/${userId}/${watchlistId}/${animeName}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrf_token,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      // console.log("     DATA FROM WATCHLIST REMOVE THUNK ", data);

      if (data.error) {
        return data.error;
      }

      await dispatch(updateWatchlists(data));
    }
    return response;
  };

export const thunkLoadAnimeToWatchlists = (userId) => async (dispatch) => {
  // First, get the CSRF token from the endpoint
  const tokenResponse = await fetch("/api/auth/csrf-token", {
    credentials: "include", // Important to include credentials
  });

  if (!tokenResponse.ok) {
    return { errors: { message: "Could not fetch CSRF token" } };
  }

  const { csrf_token } = await tokenResponse.json();
  const response = await fetch(`/api/watchlists/${userId}/load`, {
    headers: { "Content-Type": "application/json", "X-CSRFToken": csrf_token },
  });

  if (response.ok) {
    const data = await response.json();

    if (data.error) {
      return data.error;
    }

    await dispatch(loadWatchlists(data));
  }
  return response;
};


const initialState = {};


function watchlistReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_ANIME: {
      let posts = 0;
      let watchlist_obj = {};
      for (let watchlist of action.payload) {
        watchlist_obj[watchlist.name] = watchlist;
        watchlist.anime.forEach(() => {
          posts += 1;
        });
      }
      watchlist_obj.posts = posts;
      return { ...state, ...watchlist_obj };
    }
    case REMOVE_ANIME: {
      let watchlist_obj = {};
      let posts = 0;
      for (let watchlist of action.payload) {
        watchlist_obj[watchlist.name] = watchlist;
        watchlist.anime.forEach(() => {
          posts += 1;
        });
      }
      watchlist_obj.posts = posts;
      console.log('PAYLOAD FROM REMOVE ANIME: \n', action.payload);

      return { ...state, ...watchlist_obj };
    }
    case ADD_ANIME: {
      // make a new object
      // iterate through action.payload
      // key - watchlist name
      // val - watchlist
      let watchlist_obj = {};
      let posts = 0;
      for (let watchlist of action.payload) {
        watchlist_obj[watchlist.name] = watchlist;
        watchlist.anime.forEach(() => {
          posts += 1;
        });
      }
      watchlist_obj.posts = posts;
      return { ...state, ...watchlist_obj };
    }
    case MOVE_ANIME: {
      // make a new object
      // iterate through action.payload
      // key - watchlist name
      // val - watchlist
      let watchlist_obj = {};
      let posts = 0;
      for (let watchlist of action.payload) {
        watchlist_obj[watchlist.name] = watchlist;
        watchlist.anime.forEach(() => {
          posts += 1;
        });
      }
      watchlist_obj.posts = posts;
      return { ...state, ...watchlist_obj };
    }
    default:
      return state;
  }
}

export default watchlistReducer;
