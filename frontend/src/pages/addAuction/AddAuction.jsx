import { React, useState, useEffect } from "react";
import axios from "axios";
import "./AddAuction.scss";

const AddAuction = () => {
  const [inputs, setInputs] = useState({
    brand: "",
    model: "",
    productionYear: "",
    fuelType: "",
    mileage: "",
    localization: "",
    color: "",
    startingPrice: "",
    capacity: "",
    img: "essa",
    description: "",
  });

  const [err, setErr] = useState(null);
  const [response, setResponse] = useState(null);
  const [brands, setBrands] = useState(null);
  const [models, setModels] = useState(null);
  const [brandId, setBrandId] = useState("");

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:8800/api/auctions",
        inputs,
        {
          withCredentials: true,
        }
      );
      setErr(null);
      setResponse(res.data);
    } catch (err) {
      setResponse(null);
      setErr(err.response.data);
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await axios.get("http://localhost:8800/api/brands", {
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
        "http://localhost:8800/api/brands/models?brandId=" + brandId,
        {
          withCredentials: "true",
        }
      );
      setModels(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  useEffect(() => {
    fetchModels();
  }, [brandId]);

  return (
    <div className="addauction">
      <h1>Dodaj Auto</h1>
      <div className="addauction__container">
        <div className="addauction__addform">
          <form>
            <div className="addauction__form-item">
              <h2>Marka</h2>
              <select name="brand" onChange={handleChange} onClick={selectId}>
                <option selected disabled>
                  Wybierz markę
                </option>
                {brands &&
                  brands.map((item) => {
                    return <option value={item.id}>{item.brandName}</option>;
                  })}
              </select>
            </div>
            <div className="addauction__form-item">
              <h2>Model</h2>
              <select name="model" onChange={handleChange}>
                <option selected disabled value="volvo">
                  Wybierz model
                </option>
                {models &&
                  models.map((item) => {
                    return <option value={item.id}>{item.modelName}</option>;
                  })}
              </select>
            </div>
            <div className="addauction__form-item">
              <h2>Rok produkcji</h2>
              <input
                type="number"
                onChange={handleChange}
                name="productionYear"
                placeholder="Wpisz rok produkcji"
              />
            </div>
            <div className="addauction__form-item">
              <h2>Rodaj paliwa</h2>
              <select name="fuelType" onChange={handleChange}>
                <option selected disabled>
                  Wybierz rodzaj paliwa
                </option>
                <option value="benzyna">Benzyna</option>
                <option value="diesel">Diesel</option>
              </select>
            </div>
            <div className="addauction__form-item">
              <h2>Przebieg</h2>
              <input
                placeholder="Wprowadź przebieg"
                name="mileage"
                type="number"
                onChange={handleChange}
              />
            </div>
            <div className="addauction__form-item">
              <h2>Lokalizacja</h2>
              <input
                placeholder="Wprowadź lokalizację"
                type="text"
                name="localization"
                onChange={handleChange}
              />
            </div>
            <div className="addauction__form-item">
              <h2>Kolor nadwozia</h2>
              <input
                placeholder="Wprowadź kolor nadwozia"
                type="text"
                name="color"
                onChange={handleChange}
              />
            </div>
            <div className="addauction__form-item">
              <h2>Cena start. EUR</h2>
              <input
                placeholder="Wprowadź cenę startową"
                type="number"
                name="startingPrice"
                onChange={handleChange}
              />
            </div>
            <div className="addauction__form-item">
              <h2>Pojemność cm³</h2>
              <input
                placeholder="Wprowadź pojemność w cm³"
                type="number"
                name="capacity"
                onChange={handleChange}
              />
            </div>
          </form>
        </div>
        <div className="addauction__addform2">
          <form>
            <div>
              <button>Dodaj zdjęcie</button>
            </div>
            <div className="addauction__form-item-desc">
              <textarea
                placeholder="Wprowadź opis samochodu"
                name="description"
                maxLength="300"
                onChange={handleChange}
              />
            </div>

            <div className="addauction__addbutton">
              <button onClick={handleClick}>Dodaj aukcję</button>
              {response ? response : err ? err : ""}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddAuction;
