import { React } from "react";
import "./Home.scss";
import NewListings from "../newlistings/NewListings";
import Auctions from "../auctions/Auctions";
import { useLocation } from "react-router-dom";

const Home = () => {
  const location = useLocation();
  return (
    <div className="home">
      <div className="home__container">
        <Auctions />
        {location.pathname === "/" && <NewListings />}
      </div>
    </div>
  );
};

export default Home;
