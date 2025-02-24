import { useSelector } from "react-redux";
import { useNavigate, Navigate} from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  thunkLoadAnimeToWatchlists,
} from "../../redux/watchlist";

function UserProfile() {
  const user = useSelector((store) => store.session.user);
  const watchlists = useSelector((store) => store.watchlists);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let posts = 0;

    useEffect(() => {
      if(user){
        dispatch(thunkLoadAnimeToWatchlists(user.id))
      }
    }, [dispatch,user])

  if(!user){
    return <Navigate to='/login'/>
  }

  function handleClick(e) {
    e.preventDefault();
    navigate(`/user/${user.id}/watchlists`);
  }

  



   return (
    <>
      {user && <h1>USER PROFILE PAGE</h1>}

      <div id="user-info">
       {user && <div className="pic&username">
          <img className="user-profile-pic"></img>
          <p>username</p>
        </div>}
        <div className="follows&btns">
          <div className="user-follow-info">
            <div id="user-profile-posts">
              {watchlists && watchlists.posts && (
                <>
                  <p>{watchlists.posts}</p>
                  <p>{watchlists.posts === 0 || watchlists.posts > 1 ? "Posts" : "Post"}</p>
                </>
              )}
            </div>
            <div id="user-profile-followers">
              {user && user.followers && (
                <>
                  <p>{user.followers.length}</p>
                  <p>
                    {user.followers.length === 0 || user.followers.length > 1
                      ? "Followers"
                      : "Follower"}{" "}
                  </p>
                </>
              )}
            </div>
            <div id="user-profile-posts">
              {user && user.user_is_following && (
                <>
                  <p>{user.user_is_following.length}</p>
                  <p>Following</p>
                </>
              )}
            </div>
          </div>
         {user && <div className="user-profile-buttons">
            <button onClick={handleClick}>Watchlist</button>
          </div>}
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
                    <a href="">
                      <img
                        style={{ width: "200px" }}
                        src={`${anime.image_url}`}
                      />
                    </a>
                  </li>
                );
              });
            })}
        </ul>
      </div>
    </>
  )
}

export default UserProfile;
