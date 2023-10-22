import React from "react";
import "./NewListings.scss";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";

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
      <h2>Nowe aukcje</h2>
      <div className="newlistings__container">
        {isLoading
          ? "Ładowanie"
          : error
          ? "Wystąpił błąd"
          : data
              .slice()
              .reverse()
              .map((item) => {
                return (
                  <div className="newlistings__auction-block">
                    <Link to={"/auction/" + item.id}>
                      <div className="newlistings__img-container">
                        <div className="newlistings__img-first-block">
                          <img
                            src={"/upload/" + item.img.split(",")[1]}
                            alt="img1"
                          />
                        </div>
                        <div className="newlistings__img-second-block">
                          {item.img.split(",")[3] && (
                            <div className="newlistings__img-second-block-first">
                              <img
                                src={"/upload/" + item.img.split(",")[3]}
                                alt="img2"
                              />
                            </div>
                          )}
                          {item.img.split(",")[5] && (
                            <div className="newlistings__img-second-block-second">
                              <img
                                src={"/upload/" + item.img.split(",")[5]}
                                alt="img3"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                    <div className="newlistings__auction-block-text">
                      <h2>
                        {item.productionYear} {item.brandName} {item.modelName}
                      </h2>
                      <p>
                        {JSON.parse(item.highlights)
                          .slice(0, 4)
                          .map((item) => {
                            return item + ", ";
                          })}
                      </p>
                      <ul>
                        {JSON.parse(item.equipment)
                          .slice(0, 3)
                          .map((item) => {
                            return <li>{item}</li>;
                          })}
                      </ul>
                      <p>{item.localization}</p>
                    </div>
                  </div>
                );
              })}
      </div>
    </div>
  );
};

export default NewListings;
