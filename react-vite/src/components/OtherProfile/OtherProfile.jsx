import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Navigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  thunkFollowOtherUser,
  thunkLoadFollows,
  thunkUnfollowOtherUser,
} from "../../redux/follows";
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
  const follows = useSelector((store) => store.follows);

  // console.log("FOLLOWS HERE      ==>", follows);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const [hasAnimeInWatchlists, setHasAnimeInWatchlists] = useState();
  const [userFollowsOtherUser, setUserFollowsOtherUser] = useState(false);

  // console.log("MARNIE FOLLOWS BOBBIE? ==>  ", userFollowsOtherUser);



  useEffect(() => {
    if (otherUser && otherUser.id && otherUser.id === Number(params.userId)) {
      dispatch(thunkLoadAnimeToWatchlists(otherUser.id));
      dispatch(thunkLoadFollows(otherUser.id));
    }
  }, [params.userId, dispatch, otherUser]);

  useEffect(() => {
    if (otherUser && otherUser.id && otherUser.id === Number(params.userId)) {
      watchlists &&
        Object.values(watchlists).map((watchlist) => {
          return watchlist?.anime?.map((anime) => {
            if (anime) {
              setHasAnimeInWatchlists(true);
            }
          });
        });
    }
    return () => {
      setHasAnimeInWatchlists(false);
    };
  }, [otherUser, params.userId, watchlists]);

  useEffect(() => {
    follows?.Followers?.forEach((follow) => {
      // console.log("Follow: =>", follow);
      if (follow.user_id === user.id) {
        setUserFollowsOtherUser(true);
      }
    });
    return () => {
      setUserFollowsOtherUser(false);
    };
  }, [follows, user?.id]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  function handleClick(e) {
    e.preventDefault();
    navigate(`/user/${otherUser.id}/watchlists`);
  }
  function handleFollowClick(e) {
    e.preventDefault();
    dispatch(
      thunkFollowOtherUser(
        user.id,
        user.username,
        otherUser.id,
        otherUser.username
      )
    );
  }
  function handleUnfollowClick(e) {
    e.preventDefault();
    dispatch(
      thunkUnfollowOtherUser(
        user.id,
        user.username,
        otherUser.id,
        otherUser.username
      )
    );
  }

  // !!!!! check the other users followers
  // state.follows.Followers
  //* iterate through the "Followers" array
  // if the session user id is in the array, display a button that says "Following"
  // ! NOT IN ARRAY:
  // display a button that says follow
  // 1. dispatch a thunk to follows redux state to add the session user to the follows

  // ! USER WANTS TO UNFOLLOW OTHER USER
  // display a button titled "Following"
  // * dispatch a thunk to follows redux store to
  //* remove the session user from the followers of the OTHER USER

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
              {otherUser && follows && (
                <>
                  <p>
                    {follows &&
                      follows["Followers"] &&
                      follows["Followers"].length &&
                      follows["Followers"].length}
                  </p>
                  <p>
                    <a
                      href={`/user/${
                        otherUser && otherUser.id && otherUser.id
                      }/followers`}
                    >
                      {(follows &&
                        follows["Followers"] &&
                        follows["Followers"].length &&
                        follows["Followers"].length === 0) ||
                      (follows &&
                        follows["Followers"] &&
                        follows["Followers"].length &&
                        follows["Followers"].length > 1)
                        ? "Followers"
                        : "Follower"}{" "}
                    </a>
                  </p>
                </>
              )}
            </div>
            <div id="user-profile-posts">
              {otherUser && (
                <>
                  <p>
                    {follows &&
                      follows["Following"] &&
                      follows["Following"].length &&
                      follows["Following"].length}
                  </p>
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
            <div className="Otheruser-profile-buttons">
              {userFollowsOtherUser ? (
                <button
                  onClick={handleUnfollowClick}
                  style={{ cursor: "pointer" }}
                >
                  Unfollow
                </button>
              ) : (
                <button
                  onClick={handleFollowClick}
                  style={{ cursor: "pointer" }}
                >
                  Follow
                </button>
              )}
              <button onClick={handleClick} style={{ cursor: "pointer" }}>
                Watchlists
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="user-profile-anime">
        <ul className="user-profile-anime-list">
          {otherUser && watchlists && hasAnimeInWatchlists ? (
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
            <h3 className="watchlist-profile-message">
              No Anime in Watchlists Yet!
            </h3>
          )}
        </ul>
      </div>
    </>
  );
}

export default OtherProfile;
