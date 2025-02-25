import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
// import { thunkLoadAnime } from "../../redux/anime";
// import { useState } from "react";

// 1. user enters anime name in search bar
// 2. fetch request is made for anime info on button click
// 3. anime gets added to the db if not exists
// 4. user gets redirected to anime detail page

function AnimeDetail() {
  const params = useParams();
  const animeState = useSelector((state) => state.anime);

  const anime_obj = JSON.parse(localStorage.getItem(`anime_${params.mal_id}`));
  console.log(" ANIME OBJECT HERE ===>", anime_obj);
  // useEffect(() => {
  // });

  console.log("THESE ARE THE PARAMS", params);
  // console.log('THIS IS IMAGE ===>   ', anime_obj['image_url']);

  return (
    <div className="anime-detail-container">
  <h1>Anime Detail Page</h1>
  <div className="anime-main-info">

  <img src={`${anime_obj.image_url}`}/>
  <h1>{anime_obj.title} </h1>
  <div className="anime-synopsis">
    <p>
      {anime_obj.synopsis}
    </p>
  </div>
  </div>
  <div className="anime-extra-info">

  </div>
    </div>
);
}

export default AnimeDetail;
