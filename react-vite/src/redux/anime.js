const REMOVE_ANIME = "watchlists/removeAnime";
const LOAD_ANIME = "watchlists/loadWatchlists";

const updateAnime = (payload) => ({
  type: LOAD_ANIME,
  payload,
});

export const thunkLoadAnime = (anime_data) => async (dispatch) => {
//   console.log("        IN LOAD ANIME THUNK ===> data...", anime_data);
  const anime_name = anime_data.title_english.split(" ").join("%20");
  const response = await fetch(`/api/anime/${anime_name}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(anime_data)
  });

    if (response.ok) {
      const data = await response.json();
      console.log('DATA HERE ==>  ', data);
      if (data.error) {
        return data.error;
      }

  //     await dispatch(loadAnime(data));
    }
  //   return response;
};

const initialState = {};

function watchlistReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_ANIME: {
      return { ...state, ...action.payload };
    }
    default:
      return state;
  }
}

export default watchlistReducer;
