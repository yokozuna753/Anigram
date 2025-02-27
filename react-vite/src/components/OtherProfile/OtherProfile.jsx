import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Navigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { thunkLoadFollows } from "../../redux/follows";
import { thunkLoadAnimeToWatchlists } from "../../redux/watchlist";

// 1. check th params for the user Id,
//! This is for other user's profile (not the logged in user)
// fetch for the user by user id in the search params
//* if the user id in the search params doesnt match the logged in user:
    // dispatch a "thunkLoadOtherUser"
    // dispatch "thunkLoadFollows"
    // dispatch "thunkLoadAnimeToWatchlists"
//* use the use State "isUserSelf" to limit access
// 
// load the friends info + "Follow" button

function OtherProfile() {
  const user = useSelector((store) => store.session.user);
  const watchlists = useSelector((store) => store.watchlists);
  const [isUserSelf, setIsUserSelf] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();

  useEffect(() => {
    if (user && user.id && user.id === Number(params.userId)) {
      setIsUserSelf(true);
      dispatch(thunkLoadAnimeToWatchlists(user.id));
      dispatch(thunkLoadFollows(user.id));
    }
    return () => {
      setIsUserSelf(false);
    };
  }, [dispatch, user]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  function handleClick(e) {
    e.preventDefault();
    navigate(`/user/${user.id}/watchlists`);
  }

  return (
    <>
      {/* {user && <h1>USER PROFILE PAGE</h1>} */}

      <div id="user-info">
        {isUserSelf && (
          <div className="pic&username">
            <img className="user-profile-pic"></img>
            <p>@{user.username}</p>
          </div>
        )}
        <div className="follows&btns">
          <div className="user-follow-info">
            <div id="user-profile-posts">
              {watchlists && watchlists.posts && (
                <>
                  <p>{watchlists.posts}</p>
                  <p>
                    {watchlists.posts === 0 || watchlists.posts > 1
                      ? "Posts"
                      : "Post"}
                  </p>
                </>
              )}
            </div>
            <div id="user-profile-followers">
              {user && user.followers && (
                <>
                  <p>{user.followers.length}</p>
                  <p>
                    <a href={`/user/${user && user.id && user.id}/followers`}>
                      {user.followers.length === 0 || user.followers.length > 1
                        ? "Followers"
                        : "Follower"}{" "}
                    </a>
                  </p>
                </>
              )}
            </div>
            <div id="user-profile-posts">
              {user && user.user_is_following && (
                <>
                  <p>{user.user_is_following.length}</p>
                  <p>
                    <a href={`/user/${user && user.id && user.id}/following`}>
                      {" "}
                      Following
                    </a>
                  </p>
                </>
              )}
            </div>
          </div>
          {user && (
            <div className="user-profile-buttons">
              <button onClick={handleClick} style={{ cursor: "pointer" }}>
                Watchlist
              </button>
            </div>
          )}
        </div>
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
                    <a
                      href={`/anime/${
                        anime && anime.id && anime.id
                      }/${encodeURIComponent(
                        anime && anime.title && anime.title
                      )}/${anime && anime.mal_id && anime.mal_id}`}
                    >
                      <img
                        style={{ width: "200px" }}
                        src={`${anime && anime.image_url && anime.image_url}`}
                      />
                    </a>
                  </li>
                );
              });
            })}
        </ul>
      </div>
    </>
  );
}

export default OtherProfile;
