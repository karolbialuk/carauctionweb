import { React, useState } from "react";
import "./Register.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const Register = () => {
  const [inputs, setInputs] = useState({
    login: "",
    password: "",
    username: "",
    email: "",
  });

  const navigate = useNavigate();
  const updatedFormData = new FormData();
  const queryClient = useQueryClient();
  const [err, setErr] = useState(null);
  const [response, setResponse] = useState(null);
  const [files, setFiles] = useState([]);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    mutation.mutate(updatedFormData);

    // for (const key in inputs) {
    //   updatedFormData.append(key, inputs[key]);
    // }
    // for (let i = 0; i < files.length; i++) {
    //   updatedFormData.append("images", files[i]);
    // }

    // try {
    //   const response = await axios.post(
    //     "http://localhost:8800/api/auth/register",
    //     updatedFormData,
    //     {
    //       withCredentials: true,
    //       headers: {
    //         "Content-Type": "multipart/form-data",
    //       },
    //     }
    //   );

    //   setResponse(response.data);
    //   setErr(null);
    //   navigate("/login");
    // } catch (err) {
    //   setErr(err.response.data);
    //   setResponse(null);
    // }
  };

  const mutation = useMutation(
    (updatedFormData) => {
      for (const key in inputs) {
        updatedFormData.append(key, inputs[key]);
      }

      for (let i = 0; i < files.length; i++) {
        updatedFormData.append("image", files[i]);
      }

      axios
        .post("http://localhost:8800/api/auth/register", updatedFormData, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          setResponse(res.data);
          navigate("/login");
        })
        .catch((err) => {
          setResponse(err.response.data);
        });
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["user"]);
        // navigate("/login");
      },
    }
  );

  const handleFileChange = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const selectedFiles = e.target.files;
    setFiles(selectedFiles);
  };
  console.log(files);

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
            <div className="register__input-container">
              <h3>Wybierz swój avatar</h3>
              <div className="register__input-label">
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  id="fileInput"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <button onClick={handleClick}>Zarejestruj</button>
          </form>
        </div>
        <div className="register__response">{response ? response : ""}</div>

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
