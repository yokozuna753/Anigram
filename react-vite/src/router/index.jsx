import { createBrowserRouter } from "react-router-dom";
import LoginFormPage from "../components/LoginFormPage";
import SignupFormPage from "../components/SignupFormPage";
import Layout from "./Layout";
import Watchlist from "../components/Watchlist/Watchlist";
import AnimeDetail from "../components/AnimeDetail/AnimeDetail";
import UserFollowers from "../components/UserFollowers/UserFollowers";
import UserFollowing from "../components/UserFollowing/UserFollowing";
import ProfileType from "../components/ProfileType/ProfileType";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <LoginFormPage />, //! Change this to render the FEED
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      {
        path: "/user/:userId/details",
        element: <ProfileType />,
      },
      {
        path: "/user/:userId/followers",
        element: <UserFollowers />,
      },
      {
        path: "/user/:userId/following",
        element: <UserFollowing />,
      },
      {
        path: "/user/:userId/watchlists",
        element: <Watchlist />,
      },
      {
        path: "/anime/:animeId/:animeName/:mal_id",
        element: <AnimeDetail />,
      },
    ],
  },
]);
