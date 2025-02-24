const REMOVE_ANIME = "watchlists/removeAnime";
const LOAD_ANIME = "watchlists/loadWatchlists";

const updateWatchlists = (payload) => ({
  type: REMOVE_ANIME,
  payload,
});

const loadWatchlists = (payload) => ({
  type: LOAD_ANIME,
  payload,
});

export const thunkRemoveAnimeFromWatchlist =
  (userId, watchlistId, animeName) => async (dispatch) => {
    const response = await fetch(
      `/api/watchlists/${userId}/${watchlistId}/${animeName}`
    );

    if (response.ok) {
      const data = await response.json();

      if (data.error) {
        return data.error;
      }

      await dispatch(updateWatchlists(data));
    }
    return response;
  };

export const thunkLoadAnimeToWatchlists = (userId) => async (dispatch) => {
  const response = await fetch(`/api/watchlists/${userId}/load`);

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

      return { ...state, ...watchlist_obj };
    }
    default:
      return state;
  }
}

export default watchlistReducer;
