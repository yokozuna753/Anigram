import { useState, useEffect } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import { useNavigate } from "react-router-dom";
import { thunkLoadAnimeToWatchlists } from "../../redux/watchlist";

function ChangeProfilePicModal() {
  const user = useSelector((state) => state.session.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // user && dispatch(thunkLoadAnimeToWatchlists(user.id));


      closeModal();
  };

  return (
    <>
      <h2>Choose a new profile picture</h2>
      <form onSubmit={handleSubmit}>
        <label>
          File Type
          <input
            type="file"
          />
        </label>
        <button type="submit" style={{ cursor: "pointer" }}>
          Submit
        </button>
      </form>
    </>
  );
}

export default ChangeProfilePicModal;
