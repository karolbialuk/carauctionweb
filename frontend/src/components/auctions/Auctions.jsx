import React from "react";
import "./Auctions.scss";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Auctions = () => {
  const location = useLocation();

  const apiPath =
    location.pathname === "/"
      ? "http://localhost:8800/api/auctions"
      : "http://localhost:8800/api/auctions/myauctions";

  const myauctionsPath = location.pathname === "/myauctions";
  const homePath = location.pathname === "/";

  const { isLoading, data, error } = useQuery(
    [homePath ? "actions" : myauctionsPath ? "actions2" : ""],
    () =>
      axios
        .get(apiPath, {
          withCredentials: true,
        })
        .then((res) => {
          return res.data;
        })
  );

  console.log(data);

  return (
    <div
      className="auctions"
      style={
        myauctionsPath ? { width: "100%" } : homePath ? { width: "80%" } : {}
      }
    >
      <div className="auctions__container">
        {isLoading
          ? "Loading"
          : error
          ? "Wystąpił błąd"
          : data.map((item) => {
              return (
                <div className="auctions__auction-block">
                  <Link to={"/auction/" + item.id}>
                    <div className="auctions__auction-block-img">
                      <img
                        src={"/upload/" + item.img.split(",")[1]}
                        alt="car"
                      />
                    </div>
                  </Link>
                  <div className="auctions__auction-block-text">
                    <h2>
                      {item.productionYear} {item.brandName} {item.modelName}
                    </h2>
                    <p>
                      {item.mileage} km, {item.capacity} cm³, {item.fuelType},{" "}
                      {item.color}
                    </p>
                    <p>{item.localization}</p>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default Auctions;
