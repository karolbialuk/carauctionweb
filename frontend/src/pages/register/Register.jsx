import { React, useState } from "react";
import "./Register.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [inputs, setInputs] = useState({
    login: "",
    password: "",
    username: "",
    email: "",
    telefon: "",
  });

  const navigate = useNavigate();

  const [err, setErr] = useState(null);
  const [response, setResponse] = useState(null);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8800/api/auth/register",
        inputs
      );

      setResponse(response.data);
      setErr(null);
      navigate("/login");
    } catch (err) {
      setErr(err.response.data);
      setResponse(null);
    }
  };

  return (
    <div className="register">
      <div className="register__container">
        <div>
          <h1>Rejestracja</h1>
        </div>
        <div className="register__elements">
          <form>
            <div className="register__input-container">
              <div className="register__input-label">
                <h3>Login</h3>
              </div>
              <input
                type="text"
                placeholder="Wpisz login"
                name="login"
                onChange={handleChange}
              />
            </div>
            <div className="register__input-container">
              <div className="register__input-label">
                <h3>Hasło</h3>
              </div>
              <input
                type="password"
                placeholder="Wpisz hasło"
                name="password"
                onChange={handleChange}
              />
            </div>
            <div className="register__input-container">
              <div className="register__input-label">
                <h3>Nazwa</h3>
              </div>
              <input
                type="text"
                placeholder="Wpisz wyświetlaną nazwę"
                name="username"
                onChange={handleChange}
              />
            </div>
            <div className="register__input-container">
              <div className="register__input-label">
                <h3>Email</h3>
              </div>
              <input
                type="text"
                placeholder="Wpisz adres email"
                name="email"
                onChange={handleChange}
              />
            </div>
            <div className="register__input-container">
              <div className="register__input-label">
                <h3>Numer telefonu</h3>
              </div>
              <input
                type="number"
                placeholder="Wpisz numer telefonu"
                name="telefon"
                maxLength={9}
                onChange={handleChange}
              />
            </div>
            <button onClick={handleClick}>Zarejestruj</button>
          </form>
        </div>
        <div className="register__response">
          {err ? err : response ? response : ""}
        </div>

        <div className="register__register-href">
          <p>
            Masz już konto?
            <span>
              <a href="/login"> zaloguj się.</a>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
