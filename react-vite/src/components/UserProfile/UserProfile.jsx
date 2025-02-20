import { useSelector } from "react-redux";

function UserProfile() {
    const user = useSelector((store) => store.session.user);

  return (
    <>
      <h1>USER PROFILE PAGE</h1>
      <div id="user-info">
        <div className="pic&username">
          <img className="user-profile-pic"></img>
          <p>username</p>
        </div>
        <div className="follows&btns">
          <div className="user-follow-info">
            <div id="user-profile-posts">
              {user && user.posts && (
                <>
                  <p>{user.posts}</p>
                  <p>Posts</p>
                </>
              )}
            </div>
            <div id="user-profile-followers">
              {user && user.posts && (
                <>
                  <p>{user.posts}</p>
                  <p>Posts</p>
                </>
              )}
            </div>
            <div id="user-profile-posts">
              {user && user.posts && (
                <>
                  <p>{user.posts}</p>
                  <p>Posts</p>
                </>
              )}
            </div>
          </div>
          <div className="user-profile-buttons">
            <button>Watchlist</button>
          </div>
        </div>
      </div>

      <div className="user-profile-anime">
        <ul className="user-profile-anime-list">
          {user && user.watchlists &&
            user.watchlists.map((watchlist) => {
              return watchlist.anime.map((anime) => {
                return (
                  <li style={{ listStyleType: "none" }} key={anime.id}>
                    <img
                      style={{ width: "200px" }}
                      src={`${anime.image_url}`}
                    />
                    <p>in watchlist</p>
                  </li>
                );
              });
            })}
        </ul>
      </div>
    </>
  );
}

export default UserProfile;
