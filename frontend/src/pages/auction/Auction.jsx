import React from "react";
import "./Auction.scss";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import NewListings from "../../components/newlistings/NewListings";

const Auction = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[2];

  const { isLoading, data, error } = useQuery([], () =>
    axios
      .get("http://localhost:8800/api/auctions?postId=" + id, {
        withCredentials: true,
      })
      .then((res) => {
        return res.data;
      })
  );

  console.log({ auction: data });

  if (isLoading) {
    return <div>Łaowanie</div>;
  } else if (error) {
    return <div>Wystąpił błąd</div>;
  } else {
    return (
      <div className="auction">
        <div className="auction__container">
          <h1>
            {data[0].productionYear} {data[0].brandName} {data[0].modelName}
          </h1>
          <h2>
            {data[0].capacity}cm³,{data[0].fuelType}, {data[0].color}
          </h2>
          <div className="auction__img-container">
            <div className="auction__big-img">
              <img src={"/upload/" + data[0].img.split(",")[1]} alt="img1" />
            </div>
            <div className="auction__small-imgs">
              {data[0].img.split(",")[1] && (
                <img src={"/upload/" + data[0].img.split(",")[1]} alt="img1" />
              )}
              {data[0].img.split(",")[3] && (
                <img src={"/upload/" + data[0].img.split(",")[3]} alt="img1" />
              )}
              {data[0].img.split(",")[5] && (
                <img src={"/upload/" + data[0].img.split(",")[5]} alt="img1" />
              )}
              {data[0].img.split(",")[7] && (
                <img src={"/upload/" + data[0].img.split(",")[7]} alt="img1" />
              )}
              {data[0].img.split(",")[9] && (
                <img src={"/upload/" + data[0].img.split(",")[9]} alt="img1" />
              )}
              {data[0].img.split(",")[11] && (
                <img src={"/upload/" + data[0].img.split(",")[11]} alt="img1" />
              )}
            </div>
          </div>
          <div className="auction__bottom-container">
            <div className="auction__info-table">
              <table class="customTable">
                <tbody>
                  <tr>
                    <td className="auction__first-row">Marka</td>
                    <td>{data[0].brandName}</td>
                    <td className="auction__first-row">Model</td>
                    <td>{data[0].modelName}</td>
                  </tr>
                  <tr>
                    <td className="auction__first-row">Rok produkcji</td>
                    <td>{data[0].productionYear}</td>
                    <td className="auction__first-row">Typ paliwa</td>
                    <td>{data[0].fuelType}</td>
                  </tr>
                  <tr>
                    <td className="auction__first-row">Przebieg</td>
                    <td>{data[0].mileage}</td>
                    <td className="auction__first-row">Kolor</td>
                    <td>{data[0].color}</td>
                  </tr>
                  <tr>
                    <td className="auction__first-row">Pojemność</td>
                    <td>{data[0].capacity}</td>
                    <td className="auction__first-row">VIN</td>
                    <td>{data[0].vin}</td>
                  </tr>
                  <tr>
                    <td className="auction__first-row">Skrzynia biegów</td>
                    <td>{data[0].transmission}</td>
                    <td className="auction__first-row">Typ nadwozia</td>
                    <td>{data[0].bodyStyle}</td>
                  </tr>
                  <tr>
                    <td className="auction__first-row">Kolor wnętrza</td>
                    <td>{data[0].interiorColor}</td>
                    <td className="auction__first-row">Typ sprzedawcy</td>
                    <td>{data[0].sellerType}</td>
                  </tr>
                </tbody>
              </table>
              <div className="auction__description">
                <h1>Opis Auta</h1>
                <p>{data[0].description}</p>
              </div>
              <div className="auction__highlights">
                <h1>Opis Auta</h1>
                <ul></ul>
              </div>
              <div className="auction__equipment">
                <h1>Opis Auta</h1>
                <p>{data[0].description}</p>
              </div>
              <div className="auction__flaws">
                <h1>Opis Auta</h1>
                <p>{data[0].description}</p>
              </div>
            </div>
            <NewListings />
          </div>
        </div>
      </div>
    );
  }
};

export default Auction;
