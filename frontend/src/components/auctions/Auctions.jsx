import { React, useEffect, useState } from "react";
import "./Auctions.scss";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useNavbarContext } from "../../context";

const Auctions = () => {
  const location = useLocation();

  const { searchValue } = useNavbarContext();
  const [searchData, setSearchData] = useState();
  const [filterData, setFilterData] = useState();
  const [filter, setFilter] = useState({
    bodyStyle: "",
    transmission: "",
    fuelType: "",
  });

  const handleChange = (e) => {
    setFilter((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  console.log(filter);

  // useEffect(() => {
  //   axios
  //     .get("http://localhost:8800/api/auctions/search?search=" + searchValue, {
  //       withCredentials: true,
  //     })
  //     .then((res) => {
  //       setSearchData(res.data);
  //     });
  // }, [searchValue]);

  // useEffect(() => {
  //   const filterString = JSON.stringify(filter);

  //   console.log(filterString);

  //   axios
  //     .get("http://localhost:8800/api/auctions/filter?filter=" + filterString, {
  //       withCredentials: true,
  //     })
  //     .then((res) => {
  //       setFilterData(res.data);
  //     });
  // }, [filter]);

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

  const array = [];

  return (
    <div
      className="auctions"
      style={
        myauctionsPath ? { width: "100%" } : homePath ? { width: "80%" } : {}
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
        {/* {isLoading
          ? "Loading"
          : error
          ? "Wystąpił błąd"
          : (() => {
              if (searchValue && searchData.length > 0 && filter) {
                return searchData.map((item) => (
                  <div className="auctions__auction-block" key={item.id}>
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
                ));
              } else if (!searchValue && filter && filterData) {
                return filterData.map((item) => (
                  <div className="auctions__auction-block" key={item.id}>
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
                ));
              } else if (!searchValue) {
                return data.map((item) => (
                  <div className="auctions__auction-block" key={item.id}>
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
                ));
              } else {
                return array.map((item) => (
                  <div className="auctions__auction-block" key={item.id}>
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
                ));
              }
            })()} */}
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

              if (!searchValue && !filter) {
                return data.map((item) => (
                  <div className="auctions__auction-block" key={item.id}>
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
                ));
              }

              return filteredData.map((item) => (
                <div className="auctions__auction-block" key={item.id}>
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
              ));
            })()}
      </div>
    </div>
  );
};

export default Auctions;
