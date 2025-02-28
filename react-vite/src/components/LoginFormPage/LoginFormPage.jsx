import { useState, useEffect } from "react";
import { thunkLogin } from "../../redux/session";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./LoginForm.css";
import { thunkLoadAnimeToWatchlists } from "../../redux/watchlist";

function LoginFormPage() {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (sessionUser) {
      dispatch(thunkLoadAnimeToWatchlists(sessionUser.id))
      navigate(`/user/${sessionUser.id}/details`);
    }
  }, [sessionUser, navigate,dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(
      thunkLogin({
        email,
        password,
      })
    );
    
    // If serverResponse exists, it means there were errors
    if (serverResponse) {
      setErrors(serverResponse);
    }
    // No need for an else clause - the sessionUser check will handle redirect
};

  return (
    <>
      <h1>Log In</h1>
      {errors.length > 0 &&
        errors.map((message) => <p key={message}>{message}</p>)}
      <form onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {errors.email && <p>{errors.email}</p>}
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password && <p>{errors.password}</p>}
        <button type="submit" style={{cursor: "pointer"}}>Log In</button>
      </form>
    </>
  );
}

export default LoginFormPage;
