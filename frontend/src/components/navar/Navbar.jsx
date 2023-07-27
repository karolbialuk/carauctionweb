import React from "react";
import "./Navbar.scss";

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="navbar__container">
        <div className="navbar__left-content">
          <div>
            <h1>
              auta<span> & </span>aukcje
            </h1>
          </div>
          <div>
            <h3>Aukcje</h3>
          </div>
          <div>
            <h3>Wystaw auto</h3>
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
