

import { Navigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { thunkAddAnimeToWatchlist, thunkLoadAnimeToWatchlists } from "../../redux/watchlist";
import { thunkPopulateAnime } from '../../redux/anime';
import "./AnimeDetail.css";

function AnimeDetail() {
  const user = useSelector((state) => state.session?.user);
  const anime = useSelector((state) => state?.anime);
  const watchlists = useSelector((state) => state?.watchlists);
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [inWatchlist, setInWatchlist] = useState(false);
  const [showWatchlists, setShowWatchlists] = useState(false);
  const watchlistDropdownRef = useRef(null);
  const watchlistButtonRef = useRef(null);

  const anime_obj = anime && anime[`anime_${params.mal_id}`];

  useEffect(() => {
    if (user) {
      dispatch(thunkLoadAnimeToWatchlists(user.id));
      dispatch(thunkPopulateAnime());
    }
  }, [dispatch, user]);

  useEffect(() => {
    const watchlist_arr = Object.values(watchlists);
    for (let watchlist of watchlist_arr) {
      if (watchlist.anime) {
        for (let anime of watchlist.anime) {
          if (anime?.title === anime_obj?.title) {
            setInWatchlist(true);
          }
        }
      }
    }

    return () => {
      setInWatchlist(false);
    };
  }, [watchlists, anime_obj?.title]);

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

  function handleAddToWatchlist(userId, watchlistId, anime_obj) {
    dispatch(thunkAddAnimeToWatchlist(userId, watchlistId, anime_obj));
    setShowWatchlists(false);
  }

  if (!anime_obj) {
    return <div className="anime-detail-container">Loading anime details...</div>;
  }

  return (
    <div className="anime-detail-container">
      <div className="anime-detail-header">
        <div className="anime-detail-image">
          <a
            href={anime_obj.mal_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={anime_obj.image_url} alt={anime_obj.title} />
          </a>
          
          <div className="action-buttons" style={{ marginTop: "15px" }}>
            <div style={{ position: "relative" }}>
              {inWatchlist ? (
                <button
                  className="action-button in-watchlist-button"
                  onClick={redirectToWatchlist}
                >
                  <i className="fas fa-check"></i> In Watchlist
                </button>
              ) : (
                <button
                  className="action-button watchlist-button"
                  ref={watchlistButtonRef}
                  onClick={() => setShowWatchlists(!showWatchlists)}
                >
                  <i className="fas fa-plus"></i> Add To Watchlist
                </button>
              )}

              {/* Watchlist dropdown */}
              {showWatchlists && (
                <div
                  ref={watchlistDropdownRef}
                  className="watchlist-dropdown"
                >
                  <h4>Select a watchlist:</h4>
                  {Object.values(watchlists).length > 0 ? (
                    Object.values(watchlists)
                      .filter(
                        (watchlist) =>
                          watchlist && watchlist.id && watchlist.name
                      )
                      .map((watchlist, index) => (
                        <div
                          key={watchlist.id || index}
                          onClick={() =>
                            handleAddToWatchlist(
                              user.id,
                              watchlist.id,
                              anime_obj
                            )
                          }
                          className="watchlist-item"
                        >
                          {watchlist.name}
                        </div>
                      ))
                  ) : (
                    <div className="no-watchlists">
                      No watchlists found. Create one first.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="anime-main-info">
          <h1 className="anime-title">{anime_obj.title}</h1>
          
          <div className="anime-info-grid">
            <div className="info-item">
              <span className="info-label">Rating:</span>
              <span className="info-value">{anime_obj.rating || "N/A"}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Likes:</span>
              <span className="info-value">{anime_obj.likes || 0}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Producers:</span>
              <span className="info-value">{anime_obj.producers || "N/A"}</span>
            </div>
            {anime_obj.type && (
              <div className="info-item">
                <span className="info-label">Type:</span>
                <span className="info-value">{anime_obj.type}</span>
              </div>
            )}
            {anime_obj.episodes && (
              <div className="info-item">
                <span className="info-label">Episodes:</span>
                <span className="info-value">{anime_obj.episodes}</span>
              </div>
            )}
            {anime_obj.status && (
              <div className="info-item">
                <span className="info-label">Status:</span>
                <span className="info-value">{anime_obj.status}</span>
              </div>
            )}
          </div>
          
          <div className="anime-synopsis">
            <h3>Synopsis</h3>
            <p>{anime_obj.synopsis || "No synopsis available."}</p>
          </div>
        </div>
      </div>
      
      {anime_obj.genres && anime_obj.genres.length > 0 && (
        <div className="anime-extras">
          <h2 className="section-title">Genres</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {anime_obj.genres.map((genre, index) => (
              <span 
                key={index}
                style={{
                  backgroundColor: "#444",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontSize: "14px"
                }}
              >
                {genre}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AnimeDetail;
