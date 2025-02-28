const ADD_ANIME = "watchlists/addAnime";
const REMOVE_ANIME = "watchlists/removeAnime";
const LOAD_ANIME = "watchlists/loadWatchlists";

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

export const thunkAddAnimeToWatchlist =
  (userId, watchlistId, anime_obj) => async (dispatch) => {
    // console.log(
    //   "userId ==>  ",
    //   userId,
    //   "watchlistId: ",
    //   watchlistId,
    //   "anime object: ",
    //   anime_obj
    // );

    // add the anime to the watchlist
    const response = await fetch(
      `/api/watchlists/${userId}/${watchlistId}/${encodeURIComponent(
        anime_obj.title
      )}/add`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
      let final_anime_obj;
      const data = await response.json();
      for (let watchlist of data) {
        for (let anime of watchlist.anime) {
          if (anime.title === anime_obj.title) {
            final_anime_obj = anime;
          }
        }
      }

      // console.log('WATCHLIST ADD ANIME THUNK ---->  ', final_anime_obj);

      localStorage.setItem(
        `anime_${final_anime_obj.mal_id}`,
        JSON.stringify(final_anime_obj)
      );

      if (data.error) {
        return data.error;
      }

      await dispatch(addAnimeToWatchlist(data));
    }
    return response;
  };

export const thunkRemoveAnimeFromWatchlist =
  (userId, watchlistId, animeName) => async (dispatch) => {
    // //console.log('userId ',userId, 'watchlistId', watchlistId, 'anime: ', animeName );
    const response = await fetch(
      `/api/watchlists/${userId}/${watchlistId}/${animeName}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log("     DATA FROM WATCHLIST REMOVE THUNK ", data);

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
    default:
      return state;
  }
}

export default watchlistReducer;
