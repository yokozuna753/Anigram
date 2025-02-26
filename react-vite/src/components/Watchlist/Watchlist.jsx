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
  const [animeToDeleteFromWatchlist, setAnimeToDeleteFromWatchlist] =
    useState("");
  const [watchlistIdToDelete, setWatchlistIdToDelete] = useState();
  const [watchlistIdToView, setWatchlistIdToView] = useState(undefined);
  const [watchlistName, setWatchlistName] = useState(undefined);
  const [activeWatchlistId, setActiveWatchlistId] = useState(null);

  const user = useSelector((store) => store.session.user);
  const watchlists = useSelector((store) => store.watchlists);
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      watchlistIdToView === undefined &&
      watchlists &&
      Object.values(watchlists).length
    ) {
      // console.log('WATCHLISTS FROM USE EFFECT ==>   ', Object.values(watchlists));
      let watchlists_array = Object.values(watchlists);
      setWatchlistIdToView(watchlists_array[0].id);
      setWatchlistName(watchlists_array[0].name);
      setActiveWatchlistId(watchlists_array[0].id)

    }
  }, [
    setWatchlistIdToView,
    watchlistIdToView,
    setActiveWatchlistId,
    watchlists,
  ]);

  useEffect(() => {
    if (user) {
      dispatch(thunkLoadAnimeToWatchlists(user.id));
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (animeToDeleteFromWatchlist && watchlistIdToDelete) {
      console.log("DELETING...", animeToDeleteFromWatchlist);
      let animeName = animeToDeleteFromWatchlist.split(" ").join("%20");
      console.log("FINAL ANIME NAME ==>", animeName);

      dispatch(
        thunkRemoveAnimeFromWatchlist(user.id, watchlistIdToDelete, animeName)
      );

      // Reset state after dispatching the action
      setAnimeToDeleteFromWatchlist("");
      setWatchlistIdToDelete(undefined);
    }
  }, [user, dispatch, animeToDeleteFromWatchlist, watchlistIdToDelete]);

  function handleEditClick(e) {
    e.preventDefault();
    setEdit(!edit);
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  // ! BUTTONS TO TOGGLE WATCH LIST TO VIEW
  // have a button for each watchlist with the watchlist name
  // if a new watchlist is created, a new button with that name will be added
  // iterate through the watchlists array and display buttons for each name
  // ! MAX 4 WATCH LISTS

  return (
    <>
      <h1>{watchlistName}</h1>
      <div id="watchlist-buttons-div">
        {watchlists &&
          Object.values(watchlists)
            .filter((watchlist) => watchlist.id)
            .map((watchlist) => {
              return (
                <button
                  key={watchlist.id}
                  onClick={() => {
                    setWatchlistIdToView(watchlist.id);
                    setWatchlistName(watchlist.name)
                    setActiveWatchlistId(watchlist.id);
                  }}
                  style={{
                    backgroundColor: activeWatchlistId === watchlist.id ? "#CBC3E3" : ""
                  }}
                  className="watchlist-button-individual"
                >
                  {watchlist.name}
                </button>
              );
            })}
      </div>
      <div id="watchlist-button">
        <button onClick={handleEditClick}>Edit Watchlist</button>
      </div>
      <div className="user-profile-anime">
        <ul className="user-profile-anime-list">
          {watchlists &&
            Object.values(watchlists)
              .filter(
                (watchlist) =>
                  watchlist &&
                  typeof watchlist === "object" &&
                  Array.isArray(watchlist.anime)
              )
              .map((watchlist) => {
                if (watchlist.id === watchlistIdToView)
                  return watchlist.anime.map((anime) => (
                    <li style={{ listStyleType: "none" }} key={anime.id}>
                      <div>
                        <a
                          href={`/anime/${anime.id}/${encodeURIComponent(
                            anime.title
                          )}/${anime.mal_id}`}
                        >
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
                              setAnimeToDeleteFromWatchlist(anime.title);
                              setWatchlistIdToDelete(watchlist.id);
                            }}
                            style={{color: 'red'}}
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
