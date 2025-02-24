import { createBrowserRouter } from "react-router-dom";
import LoginFormPage from "../components/LoginFormPage";
import SignupFormPage from "../components/SignupFormPage";
import Layout from "./Layout";
import UserProfile from "../components/UserProfile/UserProfile";
import Watchlist from "../components/Watchlist/Watchlist";
import AnimeDetail from "../components/AnimeDetail/AnimeDetail";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <h1>Welcome!</h1>, //! Change this to render the FEED
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
        element: <UserProfile />,
      },
      {
        path: "/user/:userId/watchlists",
        element: <Watchlist />,
      },
      {
        path: "/anime/:animeId",
        element: <AnimeDetail />,
      },
    ],
  },
]);
