import { Navigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {thunkAddAnimeToWatchlist} from '../../redux/watchlist'

// import { thunkLoadAnime } from "../../redux/anime";
// import { useState } from "react";

// 1. user enters anime name in search bar
// 2. fetch request is made for anime info on button click
// 3. anime gets added to the db if not exists
// 4. user gets redirected to anime detail page

function AnimeDetail() {

  const user = useSelector((state) => state.session.user);
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const animeState = useSelector((state) => state.anime);
  const [inWatchlist, setInWatchlist] = useState(false);
  
  // useEffect(()=>{
  //   if(!user){
  //     // (async () => {

  //        navigate('/login')
    
  //     // })();
  //   }

  // },[user])


 

  const anime_obj = JSON.parse(localStorage.getItem(`anime_${params.mal_id}`));
  console.log(" ANIME OBJECT HERE ===>", anime_obj);
  useEffect(() => {
    // check the anime redux state  for the anime name
    const animeInWatchlist = animeState[params.animeName];
    // console.log('      FROM USE EFFECT', animeInWatchlist);
    if (animeInWatchlist.watchlist_id) setInWatchlist(true);
    else {
      // dispatch()
    }
  }, [animeState, params.animeName]);

  if(!user){
    return <Navigate to='/login'/>
  }

  console.log("THESE ARE THE PARAMS", params);
  // console.log('THIS IS IMAGE ===>   ', anime_obj['image_url']);

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
