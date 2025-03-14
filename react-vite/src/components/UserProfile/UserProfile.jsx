import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Navigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
// import { thunkLoadFollows } from "../../redux/follows";
import { thunkLoadAnimeToWatchlists } from "../../redux/watchlist";
import { thunkPopulateAnime } from "../../redux/anime";
import "./UserProfile.css";
import ChangeProfilePicModal from "../ChangeProfilePicModal/ChangeProfilePicModal";
import { useModal } from "../../context/Modal";

// 1. check th params for the user Id,
// if it matches, load the logged in user's info
// if not matches, load the friends info + "Follow" button

function UserProfile() {
  const user = useSelector((store) => store?.session?.user);
  const watchlists = useSelector((store) => store?.watchlists);
  const animeState = useSelector((state) => state?.anime);
  const follows = useSelector((store) => store?.follows);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const [hasAnimeInWatchlists, setHasAnimeInWatchlists] = useState();
  const { setModalContent } = useModal();

  useEffect(() => {
    if (user) dispatch(thunkLoadAnimeToWatchlists(user.id));
    if (
      animeState &&
      Object.keys(animeState).length &&
      !Object.keys(animeState).length
    ) {
      dispatch(thunkPopulateAnime());
    }
  }, [animeState, dispatch, user]);

  useEffect(() => {
    if (user && user.id && user.id === Number(params.userId)) {
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
  }, [user, params.userId, watchlists]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  function handlePicClick(e) {
    e.preventDefault();

    setModalContent(<ChangeProfilePicModal user={user}/>);
  }

  function handleClick(e) {
    e.preventDefault();
    navigate(`/user/${user && user.id}/watchlists`);
  }

  return (
    <div id="user-profile-container">
      {/* 
      - user hovers over their profile pic
      - "Edit" prompt shows up on the picture 
      */}

      <div id="user-info">
        <div className="pic&username">
          <img className="user-profile-pic" src="" onClick={handlePicClick} />
          <p>@{user.username}</p>
        </div>



        <div className="follows-btns">
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
              {user && follows && (
                <>
                  <p>
                    {follows &&
                      follows["Followers"] &&
                      follows["Followers"].length}
                  </p>
                  <p className="follows">
                    <a href={`/user/${user && user.id && user.id}/followers`}>
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
            <div>

        </div>
            <div id="user-profile-posts">
              {user && (
                <>
                  <p>
                    {follows &&
                      follows["Following"] &&
                      follows["Following"].length &&
                      follows["Following"].length}
                  </p>
                  <p className="follows">
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
          {user && watchlists && hasAnimeInWatchlists ? (
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
                            className="anime-images-profile"
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
    </div>
  );
}

export default UserProfile;
