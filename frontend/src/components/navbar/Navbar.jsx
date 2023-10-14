import { React, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.scss";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavbarContext } from "../../context";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const logout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  const { searchValue, setSearchValue } = useNavbarContext();

  const location = useLocation();

  const search = location.pathname === "/addauction" || (
    <input
      onChange={(e) => setSearchValue(e.target.value)}
      type="text"
      placeholder="Wyszukaj auto"
    />
  );

  const queryClient = useQueryClient();

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
          <div>
            <h3>
              <Link to="/myauctions">Moje aukcje</Link>
            </h3>
          </div>
          <div>
            <h3>
              <Link to="/favourite">Zapisane aukcje</Link>
            </h3>
          </div>
        </div>
        <div className="navbar__right-content">
          {search}
          <button onClick={logout}>Wyloguj</button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
