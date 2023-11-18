import { React, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Navbar.scss";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavbarContext } from "../../context";
import { useLocation } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaCarSide } from "react-icons/fa";
import { BsFillCarFrontFill, BsFillBookmarkHeartFill } from "react-icons/bs";
import { FaListAlt } from "react-icons/fa";

const Navbar = () => {
  const logout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  const { searchValue, setSearchValue } = useNavbarContext();
  const [activeHamburger, setActiveHamburger] = useState(false);
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);

  const location = useLocation();

  const img =
    JSON.parse(localStorage.getItem("user")).img &&
    JSON.parse(localStorage.getItem("user")).img.split(",")[0];

  console.log(img);

  const search = location.pathname === "/addauction" ||
    location.pathname.split("/")[1] === "auction" || (
      <input
        onChange={(e) => setSearchValue(e.target.value)}
        type="text"
        placeholder="Wyszukaj auto"
      />
    );

  const handleClick = () => {
    setActiveHamburger(!activeHamburger);
    setProfileMenuOpen(false);
  };

  const handleClick2 = () => {
    setProfileMenuOpen(!isProfileMenuOpen);
    setActiveHamburger(false);
  };

  const queryClient = useQueryClient();

  console.log(isProfileMenuOpen);

  return (
    <div className="navbar">
      <div className="navbar__container">
        <div className="navbar__left-content">
          <div>
            <h1>
              <Link to="/">
                auta<span> & </span>aukcje
              </Link>
            </h1>
          </div>
          <div>
            <h3>
              <Link id="first-link" to="/">
                Aukcje
              </Link>
            </h3>
          </div>
          <div>
            <h3>
              <Link id="second-link" to="/addauction">
                Wystaw auto
              </Link>
            </h3>
          </div>
          <div>
            <h3>
              <Link id="third-link" to="/myauctions">
                Moje aukcje
              </Link>
            </h3>
          </div>
          <div>
            <h3>
              <Link id="four-link" to="/favourite">
                Zapisane aukcje
              </Link>
            </h3>
          </div>
        </div>
        <div className="navbar__right-content">
          {search}

          <div className="navbar__img-container" onClick={handleClick2}>
            {img === "brak" ? (
              <img src={"/upload/no-avatar.jpg"} alt="avatar" />
            ) : (
              <img src={"/upload/" + img} alt="avatar" />
            )}
            {isProfileMenuOpen && (
              <div className="navbar__profile-menu">
                <div
                  id="profile-menu-list"
                  className="navbar__profile-menu-list"
                >
                  <ul>
                    <a href="/profile">
                      <li>
                        <FaCarSide />
                        <div>Profil</div>
                      </li>
                    </a>
                    <li>
                      <button className="navbar__logout-btn" onClick={logout}>
                        Wyloguj
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
        <div onClick={handleClick} className="navbar__hamburger-menu">
          <GiHamburgerMenu />
          {activeHamburger && (
            <div
              id="hamburger-menu-list"
              className="navbar__hamburger-menu-list"
            >
              <ul>
                <a href="/">
                  <li>
                    <FaCarSide />
                    <div>Aukcje</div>
                  </li>
                </a>
                <a href="/addauction">
                  <li>
                    <BsFillCarFrontFill />
                    <div>Wystaw auto</div>
                  </li>
                </a>
                <a href="/myauctions">
                  <li>
                    <FaListAlt />
                    <div>Moje aukcje</div>
                  </li>
                </a>
                <a href="/favourite">
                  <li>
                    <BsFillBookmarkHeartFill /> <div>Zapisane</div>
                  </li>
                </a>
                <button className="navbar__logout-btn" onClick={logout}>
                  Wyloguj
                </button>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
