import { React } from "react";
import "./Home.scss";
import NewListings from "../newlistings/NewListings";

import Auctions from "../auctions/Auctions";

const Home = () => {
  return (
    <div className="home">
      <div className="home__container">
        <Auctions />
        <NewListings />
      </div>
    </div>
  );
};

export default Home;
