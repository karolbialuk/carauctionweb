import { React, useEffect, useState } from "react";
import "./Auctions.scss";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useNavbarContext } from "../../context";
import { AiOutlineStar } from "react-icons/ai";

const Auctions = () => {
  const location = useLocation();

  const userId = JSON.parse(localStorage.getItem("user")).id;

  const { searchValue } = useNavbarContext();
  const [searchData, setSearchData] = useState();
  const [filterData, setFilterData] = useState();
  const [isFunctionExecuting, setIsFunctionExecuting] = useState(false);
  const [filter, setFilter] = useState({
    bodyStyle: "",
    transmission: "",
    fuelType: "",
  });

  const handleChange = (e) => {
    setFilter((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const likeAuction = async (event, auctionId) => {
    const element = document.getElementById(auctionId);

    if (element.classList.contains("active")) {
      element.classList.remove("active");
    } else {
      element.classList.add("active");
    }

    const inputs = {
      userId,
      auctionId,
    };
    try {
      await axios.post("http://localhost:8800/api/favourites/like", inputs, {
        withCredentials: true,
      });
    } catch (err) {
      console.log(err);
    }
    setIsFunctionExecuting((prev) => !prev);
  };

  const apiPath =
    location.pathname === "/" || location.pathname === "/favourite"
      ? "http://localhost:8800/api/auctions"
      : "http://localhost:8800/api/auctions/myauctions";

  const myauctionsPath = location.pathname === "/myauctions";
  const homePath = location.pathname === "/";

  const { isLoading, data, error, refetch } = useQuery(
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

  const { data: likedAuctions, refetch: refetchLiked } = useQuery(
    ["likedAuctions"],
    () =>
      axios
        .get("http://localhost:8800/api/favourites", {
          withCredentials: true,
        })
        .then((res) => {
          return res.data;
        })
  );

  useEffect(() => {
    refetch();
    refetchLiked();
  }, [location.pathname, isFunctionExecuting]);

  const liked =
    likedAuctions &&
    likedAuctions.map((item) => {
      if (item.idUser === userId) {
        return item.idAuction;
      }
    });

  const array = [];

  return (
    <div
      className="auctions"
      style={
        myauctionsPath || location.pathname === "/favourite"
          ? { width: "100%" }
          : homePath
          ? { width: "80%" }
          : {}
      }
    >
      <div className="auctions__auction-selectors">
        <h2>Ogłoszenia</h2>
        <div className="auctions__auction-selector-container">
          <select name="bodyStyle" onChange={handleChange}>
            <option selected disabled>
              Typ nadwozia
            </option>
            <option value="coupe">Copue</option>
            <option value="sedan">Sedan</option>
            <option value="combi">Combi</option>
            <option value="suv">Suv</option>
          </select>

          <select name="transmission" onChange={handleChange}>
            <option selected disabled>
              Skrzynia biegów
            </option>
            <option value="automatyczna">Automatyczna</option>
            <option value="manualna">Manualna</option>
          </select>

          <select name="fuelType" onChange={handleChange}>
            <option selected disabled>
              Rodzaj paliwa
            </option>
            <option value="benzyna">Benzyna</option>
            <option value="diesel">Diesel</option>
          </select>
        </div>
      </div>

      <div className="auctions__container">
        {isLoading
          ? "Loading"
          : error
          ? "Wystąpił błąd"
          : (() => {
              let filteredData = data;

              if (searchValue) {
                filteredData = data.filter(
                  (item) =>
                    item.brandName
                      .toLowerCase()
                      .includes(searchValue.toLowerCase()) ||
                    item.modelName
                      .toLowerCase()
                      .includes(searchValue.toLowerCase())
                );

                if (filteredData.length === 0) {
                  return;
                }
              }

              if (
                filter &&
                (filter.transmission || filter.bodyStyle || filter.fuelType)
              ) {
                if (filter.transmission) {
                  filteredData = filteredData.filter(
                    (item) =>
                      item.transmission.toLowerCase() ===
                      filter.transmission.toLowerCase()
                  );
                }

                if (filter.bodyStyle) {
                  filteredData = filteredData.filter(
                    (item) =>
                      item.bodyStyle.toLowerCase() ===
                      filter.bodyStyle.toLowerCase()
                  );
                }

                if (filter.fuelType) {
                  filteredData = filteredData.filter(
                    (item) =>
                      item.fuelType.toLowerCase() ===
                      filter.fuelType.toLowerCase()
                  );
                }
              }

              // if (!searchValue && !filter) {
              //   return data.map((item) => (
              //     <div className="auctions__auction-block" key={item.id}>
              //       <Link to={"/auction/" + item.id}>
              //         <div className="auctions__auction-block-img">
              //           <img
              //             src={"/upload/" + item.img.split(",")[1]}
              //             alt="car"
              //           />
              //         </div>
              //       </Link>
              //       <div className="auctions__auction-block-text">
              //         <h2>
              //           {item.productionYear} {item.brandName} {item.modelName}
              //         </h2>
              //         <p>
              //           {item.mileage} km, {item.capacity} cm³, {item.fuelType},{" "}
              //           {item.color}
              //         </p>
              //         <p>{item.localization}</p>
              //       </div>
              //     </div>
              //   ));
              // }

              let PLN = new Intl.NumberFormat("pl-PL", {
                style: "currency",
                currency: "PLN",
              });

              if (location.pathname === "/favourite") {
                filteredData = filteredData.filter((element) =>
                  liked.includes(element.id)
                );
              }

              return filteredData.map((item) => (
                <div className="auctions__auction-block" key={item.id}>
                  <Link
                    to={"/auction/" + item.id}
                    style={{ textDecoration: "none" }}
                  >
                    <div className="auctions__auction-block-img">
                      <img
                        src={"/upload/" + item.img.split(",")[1]}
                        alt="car"
                      />

                      <div className="auctions__inside-img-element2">
                        {PLN.format(item.startingPrice)}
                      </div>
                    </div>
                  </Link>
                  <div className="auctions__auction-block-text">
                    <div className="auctions__auction-block-text-container">
                      <h2>
                        {item.productionYear} {item.brandName} {item.modelName}
                      </h2>
                      <p>
                        {item.mileage} km, {item.capacity} cm³, {item.fuelType},{" "}
                        {item.color}
                      </p>
                      <p>{item.localization}</p>
                    </div>
                    {item.userId !== userId && (
                      <div
                        onClick={(event) => likeAuction(event, item.id)}
                        id={item.id}
                        className={`auctions__inside-img-element ${
                          liked && liked.includes(item.id) ? "active" : " "
                        }`}
                      >
                        <AiOutlineStar />
                      </div>
                    )}
                  </div>
                </div>
              ));
            })()}
      </div>
    </div>
  );
};

export default Auctions;
