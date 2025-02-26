import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import {
  thunkRemoveAnimeFromWatchlist,
  thunkLoadAnimeToWatchlists,
} from "../../redux/watchlist";
import { useDispatch } from "react-redux";

function Watchlist() {
  const [edit, setEdit] = useState(false);
  const [animeToDelete, setAnimeToDelete] = useState("");
  const [watchlistIdToDelete, setWatchlistIdToDelete] = useState();
  const user = useSelector((store) => store.session.user);
  const watchlists = useSelector((store) => store.watchlists);
  const dispatch = useDispatch();

  useEffect(() => {
    if(user){
      dispatch(thunkLoadAnimeToWatchlists(user.id));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (animeToDelete && watchlistIdToDelete) {
      console.log("DELETING...", animeToDelete);
      let animeName = animeToDelete.split(" ").join("%20");

      dispatch(
        thunkRemoveAnimeFromWatchlist(user.id, watchlistIdToDelete, animeName)
      );
      
      // Reset state after dispatching the action
      setAnimeToDelete("");
      setWatchlistIdToDelete(undefined);
    }
  }, [user, dispatch, animeToDelete, watchlistIdToDelete]);

  function handleEditClick(e) {
    e.preventDefault();
    setEdit(!edit);
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <div id="watchlist-button">
        <button onClick={handleEditClick}>Edit Watchlist</button>
      </div>
      <div id="watchlist-title">
        <h1>Watchlist</h1>
      </div>
      <div className="user-profile-anime">
        <ul className="user-profile-anime-list">
          {watchlists && 
            Object.values(watchlists)
              .filter(watchlist => watchlist && typeof watchlist === 'object' && Array.isArray(watchlist.anime))
              .map((watchlist) => {
                return watchlist.anime.map((anime) => (
                  <li style={{ listStyleType: "none" }} key={anime.id}>
                    <div>
                      <a href={`/anime/${anime.id}/${encodeURIComponent(anime.title)}/${anime.mal_id}`}>
                        <img
                          style={{ width: "200px" }}
                          src={`${anime.image_url}`}
                          alt={anime.title}
                        />
                        <p>{anime.title}</p>
                      </a>
                      {edit && (
                        <button
                          onClick={() => {
                            setAnimeToDelete(anime.title);
                            setWatchlistIdToDelete(watchlist.id);
                          }}
                        >
                          Remove From Watchlist
                        </button>
                      )}
                    </div>
                  </li>
                ));
              })}
        </ul>
      </div>
    </>
  );
}

export default Watchlist;