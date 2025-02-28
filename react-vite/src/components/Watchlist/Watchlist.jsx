import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import {
  thunkRemoveAnimeFromWatchlist,
  thunkLoadAnimeToWatchlists,
} from "../../redux/watchlist";
import { useDispatch } from "react-redux";
import { thunkLoadOtherUser, thunkRemoveOtherUser } from "../../redux/otherUser";

function Watchlist() {
  const [edit, setEdit] = useState(false);
  const [animeToDeleteFromWatchlist, setAnimeToDeleteFromWatchlist] =
    useState("");
  const [watchlistIdToDelete, setWatchlistIdToDelete] = useState();
  const [watchlistIdToView, setWatchlistIdToView] = useState(undefined);
  const [watchlistName, setWatchlistName] = useState(undefined);
  const [activeWatchlistId, setActiveWatchlistId] = useState(null);
  const [isUserSelf, setIsUserSelf] = useState(undefined);

  const user = useSelector((store) => store.session.user);
  const otherUser = useSelector((store) => store.otherUser.user);
  const watchlists = useSelector((store) => store.watchlists);
  const dispatch = useDispatch();
  const params = useParams();

  console.log("PARAMS ==>  ", params);

  useEffect(() => {
    if (user && user.id === Number(params.userId)) {
      setIsUserSelf(true);
    } else {
      setIsUserSelf(false);
    }
  }, [user, params.userId]);

  useEffect(()=>{
    if(user && user.id && user.id !== Number(params.userId)){
      dispatch(thunkLoadOtherUser(Number(params.userId)));
    }
    return()=>{
      dispatch(thunkRemoveOtherUser(Number(params.userId)))
    }
  },[user,dispatch,params.userId])

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
      setActiveWatchlistId(watchlists_array[0].id);
    }
  }, [
    setWatchlistIdToView,
    watchlistIdToView,
    setActiveWatchlistId,
    watchlists,
  ]);

  useEffect(() => {
    if (user && user.id && Number(params.userId) === user.id) {
      dispatch(thunkLoadAnimeToWatchlists(user.id));
    }else{
      dispatch(thunkLoadAnimeToWatchlists(otherUser.id))
    }
  }, [params.userId,otherUser.id,dispatch, user]);

  useEffect(() => {
    if (animeToDeleteFromWatchlist && watchlistIdToDelete && isUserSelf) {
      // console.log("DELETING...", animeToDeleteFromWatchlist);
      let animeName = animeToDeleteFromWatchlist.split(" ").join("%20");
      // console.log("FINAL ANIME NAME ==>", animeName);

      dispatch(
        thunkRemoveAnimeFromWatchlist(user.id, watchlistIdToDelete, animeName)
      );

      // Reset state after dispatching the action
      setAnimeToDeleteFromWatchlist("");
      setWatchlistIdToDelete(undefined);
    } else if (
      animeToDeleteFromWatchlist &&
      watchlistIdToDelete &&
      !isUserSelf
    ) {
      let animeName = animeToDeleteFromWatchlist.split(" ").join("%20");
      // console.log("FINAL ANIME NAME ==>", animeName);

      dispatch(
        thunkRemoveAnimeFromWatchlist(
          otherUser.id,
          watchlistIdToDelete,
          animeName
        )
      );

      // Reset state after dispatching the action
      setAnimeToDeleteFromWatchlist("");
      setWatchlistIdToDelete(undefined);
    }
  }, [
    user,
    dispatch,
    animeToDeleteFromWatchlist,
    watchlistIdToDelete,
    otherUser,
    isUserSelf
  ]);

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
    <div>
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
                    setWatchlistName(watchlist.name);
                    setActiveWatchlistId(watchlist.id);
                  }}
                  style={{
                    backgroundColor:
                      activeWatchlistId === watchlist.id ? "#CBC3E3" : "",
                    cursor: "pointer",
                  }}
                  className="watchlist-button-individual"
                >
                  {watchlist.name}
                </button>
              );
            })}
      </div>
      {isUserSelf && (
        <div id="watchlist-edit-button">
          <button onClick={handleEditClick} style={{ cursor: "pointer" }}>
            Edit Watchlist
          </button>
        </div>
      )}
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
                            style={{ color: "red", cursor: "pointer" }}
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
    </div>
  );
}

export default Watchlist;
