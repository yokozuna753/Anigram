import { Navigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {thunkAddAnimeToWatchlist} from '../../redux/watchlist'
import {
  thunkLoadAnimeToWatchlists,
} from "../../redux/watchlist";



function AnimeDetail() {

  const user = useSelector((state) => state.session.user);
  const watchlists = useSelector((state)=> state.watchlists)
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const animeState = useSelector((state) => state.anime);
  const [inWatchlist, setInWatchlist] = useState(false);
  
  // * iterate through the watchlists redux state and anime in each watchlist
  // * if the anime name is found & matches the current anime name
      // change the inWatchlist with the use state and use effect hooks to true
  // * if not found
      // on button click - add the anime to the watchlists
          // re-render the watchlists state with useSelector


 

  const anime_obj = JSON.parse(localStorage.getItem(`anime_${params.mal_id}`));
  console.log(" ANIME OBJECT HERE ===>", anime_obj);

   useEffect(() => {
      if(user){
        dispatch(thunkLoadAnimeToWatchlists(user.id));
      }
    }, [dispatch, user]);

  useEffect(()=>{
    const watchlist_arr = Object.values(watchlists);
    console.log(' watchlists array ==>  ', watchlist_arr);
  })

  useEffect(() => {
    // check the anime redux state  for the anime name
    const animeInWatchlist = animeState[params.animeName];
    // console.log('      FROM USE EFFECT', animeInWatchlist);
    if (animeInWatchlist && animeInWatchlist.watchlist_id) setInWatchlist(true);
    else {
      // dispatch()
    }
  }, [animeState, params.animeName]);

  if(!user){
    return <Navigate to='/login'/>
  }

  console.log("THESE ARE THE PARAMS", params);

  function redirectToWatchlist(e) {
    e.preventDefault();
  }

  function handleAddToWatchlist(e) {
    e.preventDefault();
    // button is clicked to add to watchlist
    // * pop up a dropdown of watchlists the user has
    // once a watchlist is clicked:
    // dispatch the add to watchlist thunk with the anime info necessary
  }

  return (<>{user &&
    <div className="anime-detail-container">
      <h1>Anime Detail Page</h1>
      {user && <div className="anime-detail-image">
        <img src={`${anime_obj.image_url}`} />
      </div>}
      <div className="anime-main-info">
        {inWatchlist ? (
          <button onClick={redirectToWatchlist}>In Watchlist</button>
        ) : (
          <button onClick={handleAddToWatchlist}>Add To Watchlist</button>
        )}
        <h1>{anime_obj.title} </h1>
        <div className="anime-synopsis">
          <p>{anime_obj.synopsis}</p>
        </div>
      </div>
      <div className="anime-extra-info"></div>
      <p>Likes: {anime_obj.likes}</p>
      <p>Producers: {anime_obj.producers}</p>
      <p>Rating: {anime_obj.rating}</p>
      <p>
        Trailer:{" "}
        <a
          href={`${anime_obj.trailer_url}`}
          target="_blank"
          rel="noopener noreferrer"
          >
          {" "}
          {anime_obj.trailer_url}
        </a>
      </p>
    </div>}
          </>
  );
}

export default AnimeDetail;
