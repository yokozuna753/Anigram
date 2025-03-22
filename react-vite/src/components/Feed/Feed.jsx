import { Navigate } from "react-router-dom";
import "./Feed.css";
import { useSelector } from "react-redux";

const feedData = {
  anime_21: {
    id: 3,
    mal_id: 21,
    likes: 0,
    title: "One Piece",
    image_url: "https://cdn.myanimelist.net/images/anime/1244/138851l.jpg",
    // producers: "Fuji TV",
    // rating: "PG-13 - Teens 13 or older",
    // trailer_url: "https://www.youtube.com/watch?v=-tviZNY6CSw",
  },
};

function Feed() {
  const user = useSelector((store) => store?.session?.user);
  if (!user) {
    return <Navigate to="/login" />;
  }
  return (
    <>
      <h1>Feed !!!</h1>
      <div>
        <ul>
          <li style={{ textDecoration: "none" }}>
            <img src={feedData.anime_21.image_url} />
          </li>
        </ul>
      </div>
    </>
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
// ! grab all of the anime they have and place into anime feed table (anime exists once)
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
