import { React, useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
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
    vin: "",
    transmission: "",
    bodyStyle: "",
    interiorColor: "",
    sellerType: "",
    img: [],
    description: "",
    highlights: [],
    equipment: [],
    flaws: [],
  });

  const [err, setErr] = useState(null);
  const [response, setResponse] = useState(null);
  const [brands, setBrands] = useState(null);
  const [models, setModels] = useState(null);
  const [files, setFiles] = useState([]);
  const [brandId, setBrandId] = useState("");

  const queryClient = useQueryClient();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const updatedFormData = new FormData();

  // useEffect(() => {
  //   for (const key in inputs) {
  //     updatedFormData.append(key, inputs[key]);
  //   }

  //   for (let i = 0; i < files.length; i++) {
  //     updatedFormData.append("images", files[i]);
  //   }

  //   console.log(updatedFormData);
  // }, [files, inputs]);

  const highlightsAdd = (e) => {
    e.preventDefault();
    const inputValue = document.getElementById("highlightInput").value;
    setInputs((prev) => ({
      ...prev,
      highlights: [...prev.highlights, inputValue],
    }));
    document.getElementById("highlightInput").value = "";
  };

  const equipmentAdd = (e) => {
    e.preventDefault();
    const inputValue = document.getElementById("equipmentInput").value;
    setInputs((prev) => ({
      ...prev,
      equipment: [...prev.equipment, inputValue],
    }));
    document.getElementById("equipmentInput").value = "";
  };

  console.log(inputs);

  const removeHighlights = (e) => {
    e.preventDefault();
    const value = e.target.innerHTML;
    setInputs((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((item) => item !== value),
    }));
  };

  const removeEquipment = (e) => {
    e.preventDefault();
    const value = e.target.innerHTML;
    setInputs((prev) => ({
      ...prev,
      equipment: prev.equipment.filter((item) => item !== value),
    }));
  };

  const removeFlaws = (e) => {
    e.preventDefault();
    const value = e.target.innerHTML;
    setInputs((prev) => ({
      ...prev,
      flaws: prev.flaws.filter((item) => item !== value),
    }));
  };

  const flawsAdd = (e) => {
    e.preventDefault();
    const inputValue = document.getElementById("flawsInput").value;
    setInputs((prev) => ({
      ...prev,
      flaws: [...prev.flaws, inputValue],
    }));
    document.getElementById("flawsInput").value = "";
  };

  const mutation = useMutation(
    (updatedFormData) => {
      const updatedInputs = {
        ...inputs,
        highlights: JSON.stringify(inputs.highlights),
        equipment: JSON.stringify(inputs.equipment),
        flaws: JSON.stringify(inputs.flaws),
      };

      for (const key in updatedInputs) {
        updatedFormData.append(key, updatedInputs[key]);
      }

      for (let i = 0; i < files.length; i++) {
        updatedFormData.append("images", files[i]);
      }
      return axios.post("http://localhost:8800/api/auctions", updatedFormData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["auctions"]);
      },
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();

    mutation.mutate(updatedFormData);
  };

  const handleFileChange = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const selectedFiles = e.target.files;
    setFiles([...selectedFiles]);
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
              <h2>Cena PLN</h2>
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
            <div className="addauction__form-item">
              <h2>VIN</h2>
              <input
                placeholder="Wprowadź numer VIN"
                type="number"
                name="vin"
                maxLength={11}
                onChange={handleChange}
              />
            </div>
            <div className="addauction__form-item">
              <h2>Skrzynia biegów</h2>
              <select name="transmission" onChange={handleChange}>
                <option selected disabled>
                  Skrzynia biegów
                </option>
                <option value="automatyczna">Automatyczna</option>
                <option value="manualna">Manualna</option>
              </select>
            </div>
            <div className="addauction__form-item">
              <h2>Typ nadwozia</h2>
              <select name="bodyStyle" onChange={handleChange}>
                <option selected disabled>
                  Wybierz typ nadwozia
                </option>
                <option value="coupe">Copue</option>
                <option value="sedan">Sedan</option>
                <option value="combi">Combi</option>
                <option value="suv">Suv</option>
              </select>
            </div>
            <div className="addauction__form-item">
              <h2>Kolor wnętrza</h2>
              <input
                placeholder="Wprowadź kolor wnętrza"
                type="text"
                name="interiorColor"
                onChange={handleChange}
              />
            </div>
            <div className="addauction__form-item">
              <h2>Sprzedawca</h2>
              <select name="sellerType" onChange={handleChange}>
                <option selected disabled>
                  Wybierz typ sprzedawcy
                </option>
                <option value="prywatny">Prywatny</option>
                <option value="firma">Firma</option>
              </select>
            </div>
          </form>
        </div>
        <div className="addauction__addform2">
          <form>
            <label for="fileInput" class="addauction__custom-file-input">
              Wybierz zdjęcia
            </label>
            <input
              type="file"
              name="images"
              accept="image/*"
              id="fileInput"
              multiple
              onChange={handleFileChange}
            />

            <div className="addauction__selected-files">
              {files.map((item) => {
                return <p>{item.name}</p>;
              })}
            </div>

            <div className="addauction__form-item-desc">
              <textarea
                placeholder="Wprowadź opis samochodu"
                name="description"
                maxLength="600"
                onChange={handleChange}
              />
            </div>
            <h3>Najważniejsze informacje</h3>
            <div className="addauction__form-item-list">
              <label for="highlightInput">
                <input id="highlightInput" name="highlights" type="text" />
                <button
                  id="highlightInput"
                  type="button"
                  onClick={highlightsAdd}
                >
                  Dodaj
                </button>
              </label>
            </div>
            <div className="addauction__ul-list">
              <ul>
                {inputs.highlights &&
                  inputs.highlights.map((item) => {
                    return <li onClick={removeHighlights}>{item}</li>;
                  })}
              </ul>
            </div>

            <h3>Wyposażenie</h3>
            <div className="addauction__form-item-list">
              <label for="equipmentInput">
                <input id="equipmentInput" name="equipment" type="text" />
                <button
                  id="equipmentInput"
                  type="button"
                  onClick={equipmentAdd}
                >
                  Dodaj
                </button>
              </label>
            </div>
            <div className="addauction__ul-list">
              <ul>
                {inputs.equipment &&
                  inputs.equipment.map((item) => {
                    return <li onClick={removeEquipment}>{item}</li>;
                  })}
              </ul>
            </div>

            <h3>Wady</h3>
            <div className="addauction__form-item-list">
              <label for="flawsInput">
                <input id="flawsInput" name="flaws" type="text" />
                <button id="flawsInput" type="button" onClick={flawsAdd}>
                  Dodaj
                </button>
              </label>
            </div>
            <div className="addauction__ul-list">
              <ul>
                {inputs.flaws &&
                  inputs.flaws.map((item) => {
                    return <li onClick={removeFlaws}>{item}</li>;
                  })}
              </ul>
            </div>

            <div className="addauction__addbutton">
              <button type="button" onClick={handleClick}>
                Dodaj aukcję
              </button>
              {response ? <p>{response}</p> : err ? <p>{err}</p> : ""}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddAuction;
