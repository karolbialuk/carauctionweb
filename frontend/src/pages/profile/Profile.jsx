import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import "./Profile.scss";

const Profile = () => {
  const img = JSON.parse(localStorage.getItem("user")).img.split(",")[0];
  const username = JSON.parse(localStorage.getItem("user")).username;
  const email = JSON.parse(localStorage.getItem("user")).email;
  const userId = JSON.parse(localStorage.getItem("user")).id;

  const [inputs, setInputs] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [files, setFiles] = useState([]);
  const [mail, setMail] = useState(false);
  const [response, setResponse] = useState(null);
  const [user, setUser] = useState(false);
  const [pass, setPass] = useState(false);

  const updatedFormData = new FormData();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleFileChange = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const selectedFiles = e.target.files;
    setFiles(selectedFiles);
  };

  useEffect(() => {
    if (mail) {
      setPass(false);
      setUser(false);
      setInputs((prevInputs) => ({
        ...prevInputs,
        password: "",
        username: "",
      }));
    }

    if (pass) {
      setMail(false);
      setUser(false);
      setInputs((prevInputs) => ({
        ...prevInputs,
        email: "",
        username: "",
      }));
    }

    if (user) {
      setMail(false);
      setPass(false);
      setInputs((prevInputs) => ({
        ...prevInputs,
        email: "",
        password: "",
      }));
    }
  }, [mail, pass, user]);

  const logout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  console.log(inputs);

  const [active, setActive] = useState(false);

  useEffect(() => {
    const element = document.getElementById("img-container");
    const label = document.getElementById("labelInput");

    element.addEventListener("mouseover", () => {
      setActive(true);
      element.classList.add("active");
      element.style.filter = "brightness(0.85)";
    });

    element.addEventListener("mouseleave", () => {
      setActive(false);
      element.classList.remove("active");
      element.style.filter = "brightness(1)";
    });
  }, []);

  const mutation = useMutation(
    (updatedFormData) => {
      for (const key in inputs) {
        updatedFormData.append(key, inputs[key]);
      }

      for (let i = 0; i < files.length; i++) {
        updatedFormData.append("image", files[i]);
      }

      axios
        .put("bialuk.pl:8800/api/auth", updatedFormData, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          setResponse(
            "Pomyślnie zmieniono dane. Aby zobaczyć zmiany, zaloguj się ponownie."
          );
        })
        .catch((err) => {
          setResponse(err.response.data);
        });
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["update"]);
      },
    }
  );

  const deleteMutation = useMutation(
    () => {
      axios
        .delete("http://bialuk.pl:8800/api/auth/delete?userId=" + userId, {
          withCredentials: true,
        })
        .then((res) => {
          localStorage.removeItem("user");
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["delete"]);
      },
    }
  );

  const handleClick = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    mutation.mutate(updatedFormData);
  };

  const deleteClick = () => {
    deleteMutation.mutate();
  };

  return (
    <div className="profile">
      <div className="profile__container">
        <div className="profile__options-container">
          <div id="img-container" className="profile__img-container">
            {img === "brak" ? (
              <img src={"/upload/no-avatar.jpg"} alt="avatar" />
            ) : (
              <img src={"/upload/" + img} alt="avatar" />
            )}
            {active && (
              <label id="labelInput" htmlFor="fileInput">
                Wybierz avatar
              </label>
            )}
            <input
              type="file"
              name="image"
              accept="image/*"
              id="fileInput"
              title="Wybierz avatar"
              onChange={handleFileChange}
            />
            <div className="profile__input-container">
              {/* {active && (
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  id="fileInput"
                  onChange={handleFileChange}
                />
              )} */}
            </div>
          </div>

          <div className="profile__option">
            {!user ? (
              <h3>{username}</h3>
            ) : (
              <input
                type="text"
                name="username"
                placeholder={username}
                onChange={handleChange}
              />
            )}
            <div
              onClick={() => setUser(!user)}
              className="profile__option-link"
            >
              <h4>Zmień nazwę użytkownika</h4>
            </div>
          </div>

          <div className="profile__option">
            {!mail ? (
              <h3>{email}</h3>
            ) : (
              <input
                type="text"
                name="email"
                placeholder={email}
                onChange={handleChange}
              />
            )}
            <div
              onClick={() => setMail(!mail)}
              className="profile__option-link"
            >
              <h4>Zmień Email</h4>
            </div>
          </div>

          {pass && (
            <input type="password" name="password" onChange={handleChange} />
          )}

          <div className="profile__option">
            <div
              onClick={() => {
                setPass(!pass);
              }}
              className="profile__option-link"
            >
              <h3>Zmień hasło</h3>
            </div>
          </div>

          <button onClick={deleteClick}>Usuń profil</button>

          <button onClick={handleClick}>Zapisz zmiany</button>

          <button onClick={logout}>Wyloguj</button>
          <p>{response && response}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
