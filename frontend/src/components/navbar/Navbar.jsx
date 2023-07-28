import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.scss";

const Navbar = () => {
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
              <Link to="/">Aukcje</Link>
            </h3>
          </div>
          <div>
            <h3>
              <Link to="/addauction">Wystaw auto</Link>
            </h3>
          </div>
        </div>
        <div className="navbar__right-content">
          <input type="text" placeholder="Wyszukaj auto" />
          <button>Wyloguj</button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
