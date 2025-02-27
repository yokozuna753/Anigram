import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";
import { useEffect } from "react";
// import { thunkLoadFollows } from "../../redux/follows";
import { thunkLoadAnimeToWatchlists } from "../../redux/watchlist";

// 1. check th params for the user Id,
// if it matches, load the logged in user's info
// if not matches, load the friends info + "Follow" button

function UserProfile() {
  const user = useSelector((store) => store.session.user);
  const watchlists = useSelector((store) => store.watchlists);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {

   if(user) dispatch(thunkLoadAnimeToWatchlists(user.id));
  }, [dispatch, user,]);

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

          <div className="pic&username">
            <img className="user-profile-pic"></img>
            <p>@{user.username}</p>
          </div>
        
        <div className="follows&btns">
          <div className="user-follow-info">
            <div id="user-profile-posts">
              {watchlists && (
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
                Watchlists
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="user-profile-anime">
        <ul className="user-profile-anime-list">
          {user &&
            watchlists &&
            Object.values(watchlists) &&
            Object.values(watchlists).map((watchlist) => {

              {return watchlist.anime && watchlist.anime.map((anime) => {
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
              })}
            })}
        </ul>
      </div>
    </>
  );
}

export default UserProfile;
