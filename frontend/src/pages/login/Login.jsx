import { React, useState, useEffect } from "react";
import "./Login.scss";
import axios from "axios";

const Login = () => {
  const [inputs, setInputs] = useState({
    login: "",
    password: "",
  });

  const [err, setErr] = useState(null);

  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8800/api/auth/login",
        inputs,
        {
          withCredentials: true,
        }
      );
      setCurrentUser(response.data);

      setErr(null);
    } catch (err) {
      setErr(err.response.data);
    }
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <div className="login">
      <div className="login__container">
        <div>
          <h1>Login</h1>
        </div>
        <div className="login__elements">
          <form>
            <div className="login__input-container">
              <div className="login__input-label">
                <h3>Login</h3>
              </div>
              <input
                type="text"
                placeholder="Wpisz swój login"
                name="login"
                onChange={handleChange}
              />
            </div>
            <div className="login__input-container">
              <div className="login__input-label">
                <h3>Hasło</h3>
              </div>
              <input
                type="password"
                placeholder="Wpisz swoje hasło"
                name="password"
                onChange={handleChange}
              />
            </div>
            <button onClick={handleClick}>Zaloguj</button>
          </form>
        </div>
        <div className="register__response">{err && err}</div>
        <div className="login__register-href">
          <p>
            Nie masz konta?
            <span>
              <a href="/register"> zarejestruj się.</a>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
