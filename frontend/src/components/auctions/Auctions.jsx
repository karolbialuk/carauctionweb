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
  const [brandId, setBrandId] = useState("");
  const [brands, setBrands] = useState(null);
  const [models, setModels] = useState(null);
  const [searchData, setSearchData] = useState();
  const [filterData, setFilterData] = useState();
  const [filterActive, setFilterActive] = useState(false);
  const [isFunctionExecuting, setIsFunctionExecuting] = useState(false);
  const [filter, setFilter] = useState({
    bodyStyle: "",
    transmission: "",
    fuelType: "",
    brand: "",
    model: "",
    localization: "",
    mileage: "",
    capacity: "",
    startingPrice: "",
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
      await axios.post("http://bialuk.pl:8800/api/favourites/like", inputs, {
        withCredentials: true,
      });
    } catch (err) {
      console.log(err);
    }
    setIsFunctionExecuting((prev) => !prev);
  };

  const apiPath =
    location.pathname === "/" || location.pathname === "/favourite"
      ? "http://bialuk.pl:8800/api/auctions"
      : "http://bialuk.pl:8800/api/auctions/myauctions";

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
        .get("http://bialuk.pl:8800/api/favourites", {
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

  useEffect(() => {
    setFilterActive(false);
  }, [location.pathname]);

  const liked =
    likedAuctions &&
    likedAuctions.map((item) => {
      if (item.idUser === userId) {
        return item.idAuction;
      }
    });

  const array = [];

  const showFiltersFunction = () => {
    setFilterActive(!filterActive);
    filter.brand = "";
    filter.model = "";
    filter.localization = "";
    filter.mileage = "";
    filter.capacity = "";
    filter.startingPrice = "";
  };

  const fetchBrands = async () => {
    try {
      const res = await axios.get("http://bialuk.pl:8800/api/brands", {
        withCredentials: true,
      });
      setBrands(res.data);
    } catch (err) {
      console.log(err.response.data);
    }
  };

  const selectId = (e) => {
    setBrandId(e.target.value);
  };

  const fetchModels = async () => {
    try {
      const res = await axios.get(
        "http://bialuk.pl:8800/api/brands/models?brandId=" + brandId,
        {
          withCredentials: "true",
        }
      );
      setModels(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  let PLN = new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
  });

  useEffect(() => {
    fetchBrands();
  }, []);

  useEffect(() => {
    fetchModels();
  }, [brandId]);

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

          <button
            onClick={showFiltersFunction}
            className="auctions__filter-btn"
          >
            Więcej filtrów
          </button>
        </div>
      </div>

      {filterActive && (
        <div
          style={{
            borderTop: "1px solid rgb(240, 240, 240)",
            paddingTop: "10px",
            paddingBottom: "15px",
          }}
          className="auctions__auction-selector-container"
        >
          <select name="brand" onChange={handleChange} onClick={selectId}>
            <option selected disabled>
              Marka
            </option>
            {brands &&
              brands.map((item) => {
                return <option value={item.id}>{item.brandName}</option>;
              })}
          </select>

          <select name="model" onChange={handleChange}>
            <option selected disabled value="volvo">
              Model
            </option>
            {models &&
              models.map((item) => {
                return <option value={item.id}>{item.modelName}</option>;
              })}
          </select>

          <input
            id="localization"
            name="localization"
            type="text"
            onChange={handleChange}
            placeholder="Lokalizacja"
          />
        </div>
      )}

      {filterActive && (
        <div
          style={{
            paddingBottom: "10px",
            gap: "10px",
            justifyContent: "flex-start",
          }}
          className="auctions__auction-selector-container"
        >
          <div className="auctions__label-container">
            <div className="auctions__label">
              <label for="mileage">
                Przebieg do - {filter.mileage.toString().slice(0, -3)} tyś. km
              </label>
            </div>
            <input
              id="mileage"
              name="mileage"
              type="range"
              min={0}
              max={500000}
              step="10000"
              onChange={handleChange}
            />
          </div>
          <div className="auctions__label-container">
            <div className="auctions__label">
              <label for="capacity">Pojemność do - {filter.capacity} cm³</label>
            </div>
            <input
              id="capacity"
              name="capacity"
              min={1000}
              max={8000}
              step="500"
              type="range"
              onChange={handleChange}
            />
          </div>
          <div className="auctions__label-container">
            <div className="auctions__label">
              <label for="startingPrice">
                Cena do - {PLN.format(filter.startingPrice)}
              </label>
            </div>
            <input
              id="startingPrice"
              name="startingPrice"
              min={0}
              max={1000000}
              step="5000"
              type="range"
              onChange={handleChange}
            />
          </div>
        </div>
      )}

      <div className="auctions__container">
        {isLoading
          ? "Loading"
          : error
          ? "Wystąpił błąd"
          : (() => {
              let filteredData = data;
              console.log(filteredData);
              console.log(filter.brand);
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
                (filter.transmission ||
                  filter.bodyStyle ||
                  filter.fuelType ||
                  filter.startingPrice ||
                  filter.brand ||
                  filter.localization ||
                  filter.capacity ||
                  filter.mileage)
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

                if (filter.brand) {
                  filteredData = filteredData.filter(
                    (item) => item.brandId === parseInt(filter.brand)
                  );
                }

                if (filter.model) {
                  filteredData = filteredData.filter(
                    (item) => item.modelId === parseInt(filter.model)
                  );
                }

                if (filter.capacity) {
                  filteredData = filteredData.filter(
                    (item) =>
                      parseInt(item.capacity) <= parseInt(filter.capacity)
                  );
                }

                if (filter.localization) {
                  filteredData = filteredData.filter((item) =>
                    item.localization
                      .toLowerCase()
                      .includes(filter.localization.toLocaleLowerCase())
                  );
                }

                if (filter.startingPrice) {
                  filteredData = filteredData.filter(
                    (item) =>
                      parseInt(item.startingPrice) <=
                      parseInt(filter.startingPrice)
                  );
                }

                if (filter.mileage) {
                  filteredData = filteredData.filter(
                    (item) => item.mileage <= filter.mileage
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
