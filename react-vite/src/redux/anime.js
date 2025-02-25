const LOAD_ANIME = "anime/loadAnime";

const loadAnime = (payload) => ({
  type: LOAD_ANIME,
  payload,
});

export const thunkLoadAnime = (anime_data) => async (dispatch) => {
  console.log("        IN LOAD ANIME THUNK ===> data...", anime_data);
  const anime_name = anime_data.title_english.split(" ").join("%20");
  const response = await fetch(`/api/anime/${anime_name}/load`, {
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

      await dispatch(loadAnime(data));
    }
    return response;
};

const initialState = {};

function animeReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_ANIME: {
      console.log('IN ANIME REDUCER');
      console.log(' PAYLOAD HERE ====>', action.payload);
      return { ...state, [action.payload.title]: action.payload };
    }
    default:
      return state;
  }
}

export default animeReducer;
