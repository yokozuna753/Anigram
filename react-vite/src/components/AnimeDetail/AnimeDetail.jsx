import { Navigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { thunkAddAnimeToWatchlist } from "../../redux/watchlist";
import { thunkLoadAnimeToWatchlists } from "../../redux/watchlist";

function AnimeDetail() {
  const user = useSelector((state) => state.session.user);
  const watchlists = useSelector((state) => state.watchlists);
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const animeState = useSelector((state) => state.anime);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [showWatchlists, setShowWatchlists] = useState(false);
  const watchlistDropdownRef = useRef(null);
  const watchlistButtonRef = useRef(null);

  const anime_obj = JSON.parse(localStorage.getItem(`anime_${params.mal_id}`));
  console.log(" ANIME OBJECT HERE ===>", anime_obj);

  useEffect(() => {
    if (user) {
      dispatch(thunkLoadAnimeToWatchlists(user.id));
    }
  }, [dispatch, user]);

  useEffect(() => {
    //? checks if the current anime is in the watchlist
    const watchlist_arr = Object.values(watchlists);
    // console.log(' watchlists array ==>  ', watchlist_arr);
    for (let watchlist of watchlist_arr) {
      // console.log("THIS IS WATCHLIST ANIME ==> ", watchlist_arr[watchlist].anime);
      if (watchlist.anime) {
        for (let anime of watchlist.anime) {
          // console.log('       WATCHLIST ANIME HERE ==>>>>>', (anime));
          if (anime.title === anime_obj?.title) {
            // console.log('YESSS');
            setInWatchlist(true);
          }
        }
      }
    }

    return () => {
      setInWatchlist(false);
    };
  }, [watchlists, anime_obj?.title]);

  useEffect(() => {
    // check the anime redux state for the anime name
    const animeInWatchlist = animeState[params.animeName];
    // console.log('      FROM USE EFFECT', animeInWatchlist);
    if (animeInWatchlist && animeInWatchlist.watchlist_id) setInWatchlist(true);
    else {
      // dispatch()
    }
  }, [animeState, params.animeName]);

  // Handle clicks outside the dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        watchlistDropdownRef.current &&
        !watchlistDropdownRef.current.contains(event.target) &&
        !watchlistButtonRef.current.contains(event.target)
      ) {
        setShowWatchlists(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!user) {
    return <Navigate to="/login" />;
  }

  function redirectToWatchlist(e) {
    e.preventDefault();
    navigate(`/user/${user.id}/watchlists`);
  }

  function handleAddToWatchlist(watchlistId) {
    // Add the anime to the selected watchlist
    dispatch(
      thunkAddAnimeToWatchlist({
        watchlist_id: watchlistId,
        anime: anime_obj,
      })
    );
    setShowWatchlists(false);
  }

  return (
    <>
      {user && (
        <div className="anime-detail-container">
          <h1>Anime Detail Page</h1>
          {user && (
            <div className="anime-detail-image">
              <img src={`${anime_obj.image_url}`} alt={anime_obj.title} />
            </div>
          )}
          <div className="anime-main-info">
            <div style={{ position: "relative" }}>
              {inWatchlist ? (
                <button onClick={redirectToWatchlist}>In Watchlist</button>
              ) : (
                <button
                  ref={watchlistButtonRef}
                  onClick={() => setShowWatchlists(!showWatchlists)}
                >
                  Add To Watchlist
                </button>
              )}

              {/* Watchlist dropdown */}
              {/* Watchlist dropdown */}
              {showWatchlists && (
                <div
                  ref={watchlistDropdownRef}
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: "0",
                    width: "200px",
                    backgroundColor: "white",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                    zIndex: 10,
                    padding: "10px",
                    marginTop: "5px",
                  }}
                >
                  <h4 style={{ margin: "0 0 10px 0" }}>Select a watchlist:</h4>
                  {Object.values(watchlists).length > 0 ? (
                    Object.values(watchlists)
                      .filter(
                        (watchlist) =>
                          watchlist && watchlist.id && watchlist.name
                      )
                      .map((watchlist, index) => (
                        <div
                          key={watchlist.id || index}
                          onClick={() => handleAddToWatchlist(watchlist.id)}
                          style={{
                            padding: "8px",
                            cursor: "pointer",
                            borderBottom:
                              index === Object.values(watchlists).length - 1
                                ? "none"
                                : "1px solid #eee",
                            transition: "background-color 0.2s",
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = "#f0f0f0";
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                          }}
                        >
                          {watchlist.name}
                        </div>
                      ))
                  ) : (
                    <div style={{ padding: "8px", color: "#666" }}>
                      No watchlists found. Create one first.
                    </div>
                  )}
                </div>
              )}
            </div>
            <h1>{anime_obj.title}</h1>
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
              {anime_obj.trailer_url}
            </a>
          </p>
        </div>
      )}
    </>
  );
}

export default AnimeDetail;
