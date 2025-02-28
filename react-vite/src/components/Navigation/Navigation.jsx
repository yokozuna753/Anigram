import { NavLink } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import SearchBar from "../SearchBar/SearchBar";
import "./Navigation.css";

function Navigation() {
  return (
    <ul style={{listStyleType: "none"}}>
      <li >
        <NavLink to="/">Home</NavLink>
      </li>

      <li>
        <SearchBar/>
      </li>

      <li>
        <ProfileButton />
      </li>
    </ul>
  );
}

export default Navigation;
