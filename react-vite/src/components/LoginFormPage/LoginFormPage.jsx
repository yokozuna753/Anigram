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
      dispatch(thunkLoadAnimeToWatchlists(sessionUser.id));
      navigate(`/user/${sessionUser.id}/details`);
    }
  }, [sessionUser, navigate, dispatch]);

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

  const handleSignUpClick = (e) => {
    e.preventDefault();
    navigate("/signup");
  };
  const handleDemoLogIn = async (e) => {
    e.preventDefault();
    const serverResponse = await dispatch(
      thunkLogin({
        email: "demo@aa.io",
        password: 'password',
      })
    );

    // If serverResponse exists, it means there were errors
    if (serverResponse) {
      setErrors(serverResponse);
    }
    // No need for an else clause - the sessionUser check will handle redirect
  };

  return (
    <div id="log-in-root">
      <h1>Log In</h1>
      {errors.length > 0 &&
        errors.map((message) => <p key={message}>{message}</p>)}
      <form id="fields" onSubmit={handleSubmit}>
        <div>

        <label>
          Email:
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            id="log-in-email"
            />
        </label>
            </div>
        <div>

        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            id="log-in-password"
            />
        </label>
            </div>
        <button type="submit" style={{ cursor: "pointer" }} className="log-in-buttons">
          Log In
        </button>
      </form>
      <div>
        <button onClick={handleDemoLogIn} className="log-in-buttons">Log In As Demo</button>
      </div>
      <div>
        <button onClick={handleSignUpClick} className="log-in-buttons">Sign Up</button>
      </div>
            {errors.email && <p style={{color: "orange"}}>* {errors.email}</p>}
        {errors.password && <p style={{color: "orange"}}>* {errors.password}</p>}
    </div>
  );
}

export default LoginFormPage;
