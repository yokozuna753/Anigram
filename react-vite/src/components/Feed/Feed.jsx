import { useState } from "react";
import { Navigate } from "react-router-dom";
import "./Feed.css";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";

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
  const [liked, setLiked] = useState(false);
  const [beating, setBeating] = useState(false);

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
              className={`heart ${liked ? "liked" : ""} ${beating ? "beating" : ""}`}
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
