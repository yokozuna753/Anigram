const REMOVE_ANIME = "watchlists/removeAnime";

const removeAnimeFromWatchlist = (payload) => ({
  type: REMOVE_ANIME,
  payload,
});

export const thunkRemoveAnimeFromWatchlist =
  (watchlistId, animeName) => async (dispatch) => {
    const response = await fetch(`/api/watchlists/${watchlistId}/${animeName}`);

    if (response.ok) {
      const data = await response.json();
      console.log("IN WATCHLIST THUNK \n", data);
      //     if (data.errors) {
      //       return;
      //     }

      //     dispatch(setUser(data));
    }
  };

const initialState = { watchlists: null };

function watchlistReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER: {
      let posts = 0;
      for (let watchlist of action.payload.watchlists) {
        for (let a of watchlist.anime) {
          if (a) {
            posts += 1;
          }
        }
      }
      action.payload.posts = posts;
      return { ...state, user: action.payload };
    }
    case REMOVE_USER:
      return { ...state, user: null };
    default:
      return state;
  }
}

export default watchlistReducer;
