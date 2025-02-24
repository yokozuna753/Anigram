import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      return <Navigate to="/login" />;
    }

    if (animeToDelete) {
      console.log("DELETING...", animeToDelete);
      //  grab the anime to delete name
      // split to array by spaces
      // join by %20
      let animeName = animeToDelete.split(" ").join("%20");
      // console.log(watchlistIdToDelete, 'watchlist ID');

      dispatch(
        thunkRemoveAnimeFromWatchlist(user.id, watchlistIdToDelete, animeName)
      );
    }
  }, [user,dispatch, animeToDelete, watchlistIdToDelete]);

  function handleEditClick(e) {
    e.preventDefault();
    setEdit(!edit);
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
          {user &&
            user.watchlists &&
            user.watchlists.map((watchlist) => {
              return watchlist.anime.map((anime) => {
                return (
                  // ! SET THE HREF ATTRIBUTE OF EACH ANIME IMAGE TO THE ANIME DETAIL PAGE
                  <li style={{ listStyleType: "none" }} key={anime.id}>
                    <div>
                      <a href="">
                        <img
                          style={{ width: "200px" }}
                          src={`${anime.image_url}`}
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
                );
              });
            })}
        </ul>
      </div>
    </>
  );
}

export default Watchlist;
