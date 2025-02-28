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
  console.log("        IN LOAD ANIME THUNK ===> data...", anime_data);

  try {
    // First check if we have cached data in localStorage
    const cachedAnime = localStorage.getItem(`anime_${anime_data.mal_id}`);

    if (cachedAnime) {
      // If we have cached data, use it
      const parsedAnime = JSON.parse(cachedAnime);
      dispatch(loadAnime(parsedAnime));
      return parsedAnime;
    }
    const anime_name = anime_data.title_english.split(" ").join("%20");
    const response = await fetch(`/api/anime/${anime_name}/load`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(anime_data),
    });

    if (response.ok) {
      const data = await response.json();
      // console.log('DATA HERE ==>  ', data);
      localStorage.setItem(`anime_${data.mal_id}`, JSON.stringify(data));

      await dispatch(loadAnime(data));
      return data;
    }
    return response;
  } catch (error) {
    console.error("Error loading anime:", error);
  }
};

export const thunkPopulateAnime = () => async (dispatch) => {
  const response = await fetch(`/api/anime/load/all`);

  if(response.ok){
    const data = await response.json();
    console.log('LOADING ANIME... ',data);
    dispatch(populateAnime(data))
  }
};

const initialState = {};

function animeReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_ANIME: {
      return { ...state, [action.payload.title]: action.payload };
    }
    case POPULATE_ANIME: {
      return { ...state, ...action.payload };
    }
    default:
      return state;
  }
}

export default animeReducer;
