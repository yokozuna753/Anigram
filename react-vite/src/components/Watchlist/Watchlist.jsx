import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { Navigate, useParams } from "react-router-dom";
import {
  thunkRemoveAnimeFromWatchlist,
  thunkLoadAnimeToWatchlists,
  thunkMoveAnimeToOtherWatchlist
} from "../../redux/watchlist";
import { useDispatch } from "react-redux";
import { thunkLoadOtherUser, thunkRemoveOtherUser } from "../../redux/otherUser";
import './Watchlist.css'

function Watchlist() {
  const [edit, setEdit] = useState(false);
  const [animeToDeleteFromWatchlist, setAnimeToDeleteFromWatchlist] = useState("");
  const [watchlistIdToDelete, setWatchlistIdToDelete] = useState();
  const [watchlistIdToView, setWatchlistIdToView] = useState(undefined);
  // const [watchlistIdToChange, setWatchlistIdToChangeTo] = useState(undefined);
  const [animeMalIdToChangeWatchlists, setAnimeMalIdToChangeWatchlists] = useState(undefined);
  const [watchlistName, setWatchlistName] = useState(undefined);
  const [activeWatchlistId, setActiveWatchlistId] = useState(null);
  const [isUserSelf, setIsUserSelf] = useState(undefined);
  const [showChangeWatchlistDropdown, setShowChangeWatchlistDropdown] = useState(false);
  const [changeWatchlistDropdownPosition, setChangeWatchlistDropdownPosition] = useState({ top: 0, left: 0 });
  const changeWatchlistDropdownRef = useRef(null);

  const user = useSelector((store) => store.session.user);
  const otherUser = useSelector((store) => store.otherUser?.user);
  const watchlists = useSelector((store) => store.watchlists);
  const dispatch = useDispatch();
  const params = useParams();


// ! check if the user is viewing their watchlist or another user's watchlist
  useEffect(() => {
    if (user && user.id === Number(params.userId)) {
      setIsUserSelf(true);
    } else {
      setIsUserSelf(false);
    }
  }, [user, params.userId]);

  
  // ! if the watchlists dont belong to the current user, show the other user's info
  useEffect(() => {
    if(user && user.id && user.id !== Number(params.userId)){
      dispatch(thunkLoadOtherUser(Number(params.userId)));
    }
    return () => {
      dispatch(thunkRemoveOtherUser(Number(params.userId)))
    }
  },[user,dispatch,params.userId])


  // ! if no watchlist is selected, show the content of the first watchlist
  useEffect(() => {
    if (
      watchlistIdToView === undefined &&
      watchlists &&
      Object.values(watchlists).length
    ) {
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


  // ! if viewing the current user page, display their anime in profile, else, display the other user's anime
  useEffect(() => { 
    if (user && user.id && Number(params.userId) === user.id) { 
      dispatch(thunkLoadAnimeToWatchlists(user.id)); 
    } else if (otherUser && otherUser.id && Number(params.userId) === otherUser.id){
      dispatch(thunkLoadAnimeToWatchlists(otherUser.id)) 
    }
  }, [params.userId,otherUser,dispatch, user]);


  // ! delete an anime from a watchlist so the user can move it to another
  useEffect(() => {
    if (animeToDeleteFromWatchlist && watchlistIdToDelete && isUserSelf) {
      let animeName = encodeURIComponent(animeToDeleteFromWatchlist)

      dispatch(
        thunkRemoveAnimeFromWatchlist(user.id, watchlistIdToDelete, animeName)
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
    isUserSelf
  ]);

  //! Handle clicks outside the dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        changeWatchlistDropdownRef.current &&
        !changeWatchlistDropdownRef.current.contains(event.target)
      ) {
        setShowChangeWatchlistDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleEditClick(e) {
    e.preventDefault();
    setEdit(!edit);
  }

  // !  show the dropdown for changing the watchlists
  function handleShowChangeWatchlistDropdown(e, malId) {
    const buttonRect = e.currentTarget.getBoundingClientRect();
    setChangeWatchlistDropdownPosition({
      top: buttonRect.bottom + window.scrollY,
      left: buttonRect.left + window.scrollX
    });
    setAnimeMalIdToChangeWatchlists(malId);
    setShowChangeWatchlistDropdown(true);
  }


  // ! change the selected anime to another watchlist
  async function handleChangeWatchlist(userId, newWatchlistId, animeMalId) {
    // Find the current anime object from the current watchlist
    const currentWatchlist = Object.values(watchlists).find(watchlist => watchlist.id === watchlistIdToView);
    console.log('CURRENT WATCHLIST VARIABLE: ', currentWatchlist);
    const animeToMove = currentWatchlist.anime.find(anime => anime.mal_id === animeMalId);
    console.log('ANIME TO MOVE: ', animeToMove);

    // First remove from current watchlist
    let animeName = encodeURIComponent(animeToMove.title)
    // dispatch(thunkRemoveAnimeFromWatchlist(userId, watchlistIdToView, animeName));
    setWatchlistIdToDelete(watchlistIdToView)
    setAnimeToDeleteFromWatchlist(animeName);
    
    // Then add to new watchlist
    dispatch(thunkMoveAnimeToOtherWatchlist(userId, watchlistIdToView, newWatchlistId, animeToMove));
    
    // Reset state
    setAnimeMalIdToChangeWatchlists(undefined);
    setShowChangeWatchlistDropdown(false);
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

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
                            className="anime-images-watchlist"
                          />
                          <p>{anime.title}</p>
                        </a>
                        <div id="watchlist-update-buttons">
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
                          {edit && (
                            <button
                              onClick={(e) => {
                                handleShowChangeWatchlistDropdown(e, anime.mal_id);
                              }}
                              style={{ color: "orange", cursor: "pointer" }}
                            >
                              Change Watchlist
                            </button>
                          )}
                        </div>
                      </div>
                    </li>
                  ));
              })}
        </ul>
      </div>

      {/* Change Watchlist Dropdown */}
      {showChangeWatchlistDropdown && animeMalIdToChangeWatchlists && (
        <div
          ref={changeWatchlistDropdownRef}
          className="watchlist-dropdown"
          style={{
            position: "absolute",
            top: `${changeWatchlistDropdownPosition.top}px`,
            left: `${changeWatchlistDropdownPosition.left}px`,
            zIndex: 1000,
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "10px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)"
          }}
        >
          <h4 style={{color: "black"}}>Move to watchlist:</h4>
          {watchlists && Object.values(watchlists) && Object.values(watchlists).length && Object.values(watchlists).length > 0 ? (
            Object.values(watchlists)
              .filter(
                (watchlist) =>
                  watchlist && 
                  watchlist.id && 
                  watchlist.name && 
                  watchlist.id !== watchlistIdToView // Don't show current watchlist
              )
              .map((watchlist, index) => (
                <div
                  key={watchlist.id || index}
                  onClick={() =>
                    handleChangeWatchlist(
                      user.id,
                      watchlist.id,
                      animeMalIdToChangeWatchlists
                    )
                  }
                  className="watchlist-item"
                  style={{
                    padding: "8px",
                    cursor: "pointer",
                    borderBottom: "1px solid #eee",
                    color: "black"
                    
                  }}
                >
                  {watchlist.name}
                </div>
              ))
          ) : (
            <div className="no-watchlists">
              No other watchlists found. Create one first.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Watchlist;