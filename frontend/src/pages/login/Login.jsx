import { React, useState, useEffect } from "react";
import "./Login.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [inputs, setInputs] = useState({
    login: "",
    password: "",
  });

  const [err, setErr] = useState(null);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://bialuk.pl:8800/api/auth/login",
        inputs,
        {
          withCredentials: true,
        }
      );

      localStorage.setItem("user", JSON.stringify(response.data));

      setErr(null);
      navigate("/");
    } catch (err) {
      setErr(err.response.data);
    }
  };

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
