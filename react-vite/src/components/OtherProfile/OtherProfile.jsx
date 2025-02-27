import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Navigate, useParams } from "react-router-dom";
import { useEffect } from "react";
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
  const otherUser = useSelector((store) => store.otherUser.user);
  const watchlists = useSelector((store) => store.watchlists);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();

  useEffect(() => {
    if (otherUser && otherUser.id && otherUser.id === Number(params.userId)) {
      dispatch(thunkLoadAnimeToWatchlists(otherUser.id));
      dispatch(thunkLoadFollows(otherUser.id));
    }
  }, [params.userId, dispatch, otherUser]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  function handleClick(e) {
    e.preventDefault();
    navigate(`/user/${otherUser.id}/watchlists`);
  }

  return (
    <>
      {/* {user && <h1>USER PROFILE PAGE</h1>} */}

      <div id="user-info">
        <div className="pic&username">
          <img className="user-profile-pic"></img>
          <p>@{otherUser && otherUser.username && otherUser.username}</p>
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
              {otherUser && otherUser.followers && (
                <>
                  <p>{otherUser.followers.length}</p>
                  <p>
                    <a
                      href={`/user/${
                        otherUser && otherUser.id && otherUser.id
                      }/followers`}
                    >
                      {otherUser.followers.length === 0 ||
                      otherUser.followers.length > 1
                        ? "Followers"
                        : "Follower"}{" "}
                    </a>
                  </p>
                </>
              )}
            </div>
            <div id="user-profile-posts">
              {otherUser && otherUser.user_is_following && (
                <>
                  <p>{otherUser.user_is_following.length}</p>
                  <p>
                    <a
                      href={`/user/${
                        otherUser && otherUser.id && otherUser.id
                      }/following`}
                    >
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
          {otherUser && watchlists ? (
            Object.values(watchlists) &&
            Object.values(watchlists).map((watchlist) => {
              {
                return (
                  watchlist.anime &&
                  watchlist.anime.map((anime) => {
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
                            src={`${
                              anime && anime.image_url && anime.image_url
                            }`}
                          />
                        </a>
                      </li>
                    );
                  })
                );
              }
            })
          ) : (
            <h3>No Anime in Watchlists Yet!</h3>
          )}
        </ul>
      </div>
    </>
  );
}

export default OtherProfile;
