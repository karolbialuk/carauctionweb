import React from "react";
import "./NewListings.scss";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const NewListings = () => {
  const { isLoading, data, error } = useQuery(["actions"], () =>
    axios
      .get("http://localhost:8800/api/auctions", {
        withCredentials: true,
      })
      .then((res) => {
        return res.data;
      })
  );
  return (
    <div className="newlistings">
      <div className="newlistings__container">
        <h1>Nowe aukcje</h1>
        {isLoading
          ? "Ładowanie"
          : error
          ? "Wystąpił błąd"
          : data.map((item) => {
              return (
                <div className="newlistings__auction-block">
                  <div className="newlistings__img-container">
                    <div className="newlistings__img-first-block">
                      <img
                        src={"/upload/" + item.img.split(",")[1]}
                        alt="img1"
                      />
                    </div>
                    <div className="newlistings__img-second-block">
                      <div className="newlistings__img-second-block-first">
                        <img
                          src={"/upload/" + item.img.split(",")[3]}
                          alt="img2"
                        />
                      </div>
                      <div className="newlistings__img-second-block-second">
                        <img
                          src={"/upload/" + item.img.split(",")[5]}
                          alt="img3"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="newlistings__auction-block-text">
                    <h2>2023 Porsche 718 Cayman GT4 RS</h2>
                    <p>
                      ~1,900 Miles, 4.0-Liter Flat-6, Weissach Package, 20-inch
                      Forged Wheels
                    </p>
                    <ul>
                      <li>Weissach Package</li>
                      <li>493hp 4.0L flat-6</li>
                      <li>20-inch forged wheels</li>
                    </ul>
                    <p>Monrovia, CA 91016</p>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default NewListings;
