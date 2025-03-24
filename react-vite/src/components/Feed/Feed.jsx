import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import "./Feed.css";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { thunkPopulateUsers } from "../../redux/feed";

const feedData = {
  anime_21: {
    id: 3,
    mal_id: 21,
    likes: 0,
    title: "One Piece",
    image_url: "https://cdn.myanimelist.net/images/anime/1244/138851l.jpg",
  },
};

function Feed() {
  const user = useSelector((store) => store?.session?.user);
  const dispatch = useDispatch();
  const [liked, setLiked] = useState(false);
  const [beating, setBeating] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(thunkPopulateUsers(user.id));
    }
  });

  if (!user) {
    return <Navigate to="/login" />;
  }

  const toggleLike = () => {
    setLiked(!liked);
    setBeating(true); // Trigger beat animation
    setTimeout(() => setBeating(false), 300); // Remove beat after 0.3s
  };

  return (
    <div id="feed-container">
      <div>
        <ul id="feed-content">
          <li>
            <img src={feedData.anime_21.image_url} alt="Anime" />
            <div
              className={`heart ${liked ? "liked" : ""} ${
                beating ? "beating" : ""
              }`}
              onClick={toggleLike}
            >
              <FontAwesomeIcon icon={liked ? solidHeart : regularHeart} />
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Feed;

// * GOAL: Show Feed to the users

// - User doesn't follow anyone => "Follow a user to view anime in feed!"

// * On sign up, user starts with 2-3 "following" that have anime in their watchlists

// ? what if multiple users have the same anime in their watchlist?
//* user should view an anime only once in the feed
// anime feed table:
// 1. query for all the users and their watchlists
//* Use a Set
// push all of the anime the users have in their watchlist into a set
// //  grab all of the anime they have and place into anime feed table (anime exists once)

// 2. display anime in the feed
// link that opens modal: "Demo and 13 others saved this anime"
// on modal open, display list of users that saved the anime to their watchlist
// each user shows their profile pic and a button => follow/unfollow

/*
BACKEND: 
- anime viewed once by the user
- use a set
{
    anime_{mal_id}: {...anime data, users: {...user_info}}
}
*/

// - SUB-GOAL users can view the anime of followed users' watchlists
