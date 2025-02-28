import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import SearchBar from "../SearchBar/SearchBar";
import { useSelector } from "react-redux";
import "./Navigation.css";

function Navigation() {
  const user = useSelector((store) => store.session.user);

  return (
    <ul style={{ listStyleType: "none" }}>
      {/* {user && //////! MAKE THIS REDIRECT TO THE FEED
      <li >
    <NavLink to={`/user/${user.id}/details`}>Home</NavLink>
    </li>} */}

      {user && (
        <li>
          <SearchBar />
        </li>
      )}

      {user && (
        <li>
          <ProfileButton />
        </li>
      )}
    </ul>
  );
}

export default Navigation;
