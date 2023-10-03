import React, { useState, useEffect } from "react";
import "./Auction.scss";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import NewListings from "../../components/newlistings/NewListings";
import ImageGallery from "react-image-gallery";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Auction = () => {
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const [edit, setEdit] = useState(false);
  const [brands, setBrands] = useState(null);
  const [models, setModels] = useState(null);
  const [brandId, setBrandId] = useState("");
  const [files, setFiles] = useState([]);

  const userId = JSON.parse(localStorage.getItem("user")).id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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
    highlights: "",
    equipment: "",
    flaws: "",
    auctionId: "",
  });

  const { isLoading, data, error } = useQuery(["auctions"], () =>
    axios
      .get("http://localhost:8800/api/auctions?postId=" + id, {
        withCredentials: true,
      })
      .then((res) => {
        return res.data;
      })
  );

  useEffect(() => {
    setInputs((prevState) => ({
      ...prevState,
      brand: data && data[0].brandId,
      model: data && data[0].modelId,
      productionYear: data && data[0].productionYear,
      fuelType: data && data[0].fuelType,
      mileage: data && data[0].mileage,
      localization: data && data[0].localization,
      color: data && data[0].color,
      startingPrice: data && data[0].startingPrice,
      capacity: data && data[0].capacity,
      vin: data && data[0].vin,
      transmission: data && data[0].transmission,
      bodyStyle: data && data[0].bodyStyle,
      interiorColor: data && data[0].interiorColor,
      sellerType: data && data[0].sellerType,
      img: data && data[0].img,
      description: data && data[0].description,
      highlights: data && data[0].highlights.split(","),
      equipment: data && data[0].equipment.split(","),
      flaws: data && data[0].flaws.split(","),
      auctionId: data && data[0].id,
    }));
  }, [data]);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEdit = () => {
    setEdit((prev) => !prev);
  };

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    setFiles([...selectedFiles]);
  };

  const mutation = useMutation(
    (auctionId) => {
      return axios.delete("http://localhost:8800/api/auctions/" + auctionId, {
        withCredentials: true,
      });
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["auctions"]);
        navigate("/myauctions");
      },
    }
  );

  const handleDelete = () => {
    mutation.mutate(id);
  };

  // const handleUpdate = async () => {
  //   await axios.put(
  //     "http://localhost:8800/api/auctions?auctionId=" + id,
  //     {
  //       ...inputs,
  //       highlights: inputs.highlights.join(","),
  //       equipment: inputs.equipment.join(","),
  //       flaws: inputs.flaws.join(","),
  //     },
  //     {
  //       withCredentials: true,
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //     }
  //   );
  // };

  const updateMutation = useMutation(() => {
    const changedInputs = {
      ...inputs,
      highlights: inputs.highlights.join(","),
      equipment: inputs.equipment.join(","),
      flaws: inputs.flaws.join(","),
    };

    const updatedFormData = new FormData();

    for (const key in changedInputs) {
      updatedFormData.append(key, changedInputs[key]);
    }

    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        updatedFormData.append("images", files[i]);
      }
    }

    return axios.put(
      "http://localhost:8800/api/auctions",
      updatedFormData,

      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(["updateAuctions"]);
        },
      }
    );
  });

  const handleUpdate = () => {
    updateMutation.mutate();
    setEdit(false);
    window.location.reload();
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

  console.log(inputs);
  console.log(files);

  const highlightsAdd = (e) => {
    const inputValue = document.getElementById("highlightInput").value;
    setInputs((prev) => ({
      ...prev,
      highlights: prev.highlights.concat(inputValue),
    }));
    document.getElementById("highlightInput").value = "";
    console.log(inputs);
  };

  const equipmentAdd = (e) => {
    const inputValue = document.getElementById("equipmentInput").value;
    setInputs((prev) => ({
      ...prev,
      equipment: prev.equipment.concat(inputValue),
    }));
    document.getElementById("equipmentInput").value = "";
  };

  const flawsAdd = (e) => {
    const inputValue = document.getElementById("flawsInput").value;
    setInputs((prev) => ({
      ...prev,
      flaws: prev.flaws.concat(inputValue),
    }));
    document.getElementById("flawsInput").value = "";
  };

  const removeHighlights = (e) => {
    e.preventDefault();
    const value = e.target.innerHTML;
    if (edit) {
      setInputs((prev) => ({
        ...prev,
        highlights: prev.highlights.filter((item) => item !== value),
      }));
    }
  };

  const removeEquipment = (e) => {
    e.preventDefault();
    const value = e.target.innerHTML;
    if (edit) {
      setInputs((prev) => ({
        ...prev,
        equipment: prev.equipment.filter((item) => item !== value),
      }));
    }
  };

  const removeFlaws = (e) => {
    e.preventDefault();
    const value = e.target.innerHTML;
    if (edit) {
      setInputs((prev) => ({
        ...prev,
        flaws: prev.flaws.filter((item) => item !== value),
      }));
    }
  };

  if (isLoading) {
    return <div>Ładowanie</div>;
  } else if (error) {
    return <div>Wystąpił błąd</div>;
  } else {
    const inputString = data[0].img;

    const imageStrings = inputString.split(",");

    const images = [];

    for (let i = 0; i < imageStrings.length; i += 2) {
      const highImageString = "/upload/" + imageStrings[i];
      const lowImageString = "/upload/" + imageStrings[i + 1];

      const imageObject = {
        original: highImageString,
        thumbnail: lowImageString,
      };

      images.push(imageObject);
    }

    return (
      <div className="auction">
        <div className="auction__container">
          <h1>
            {data[0].productionYear} {data[0].brandName} {data[0].modelName}
          </h1>
          <h2>
            {data[0].capacity}cm³, {data[0].fuelType}, {data[0].color}
          </h2>
          <div className="auction__button-container">
            {data[0].userId === userId && (
              <button
                onClick={handleEdit}
                className="auction__edit-button"
                style={
                  edit ? { background: "grey" } : { background: "#1c9092" }
                }
              >
                Edytuj ogłoszenie
              </button>
            )}
            {data[0].userId === userId && (
              <button onClick={handleDelete} className="auction__edit-button">
                Usuń ogłoszenie
              </button>
            )}
          </div>
          <div className="auction__img-container">
            <div className="auction__gallery">
              <ImageGallery items={images} />
            </div>
          </div>
          <div>
            {edit && data[0].userId === userId && (
              <label for="fileInput" class="auction__custom-file-input">
                Wybierz zdjęcia
              </label>
            )}

            {edit && data[0].userId === userId && (
              <input
                type="file"
                name="images"
                accept="image/*"
                id="fileInput"
                className="auction__edit-button"
                multiple
                onChange={handleFileChange}
              />
            )}
          </div>

          <div className="addauction__selected-files">
            {files.map((item) => {
              return <p>{item.name}</p>;
            })}
          </div>

          <div className="auction__bottom-container">
            <div className="auction__info-table">
              <table class="customTable">
                <tbody>
                  <tr>
                    <td className="auction__first-row">Marka</td>

                    <td>
                      {(edit && (
                        <select
                          name="brand"
                          onChange={handleChange}
                          onClick={selectId}
                        >
                          <option selected disabled>
                            Wybierz markę
                          </option>
                          {brands &&
                            brands.map((item) => {
                              return (
                                <option
                                  selected={
                                    item.brandName === data[0].brandName
                                      ? true
                                      : false
                                  }
                                  value={item.id}
                                >
                                  {item.brandName}
                                </option>
                              );
                            })}
                        </select>
                      )) ||
                        data[0].brandName}
                    </td>
                    <td className="auction__first-row">Model</td>
                    <td>
                      {(edit && (
                        <select name="model" onChange={handleChange}>
                          <option selected disabled>
                            Wybierz model
                          </option>
                          {models &&
                            models.map((item) => {
                              return (
                                <option
                                  selected={
                                    item.modelName === data[0].modelName
                                      ? true
                                      : false
                                  }
                                  value={item.id}
                                >
                                  {item.modelName}
                                </option>
                              );
                            })}
                        </select>
                      )) ||
                        data[0].modelName}
                    </td>
                  </tr>
                  <tr>
                    <td className="auction__first-row">Rok produkcji</td>
                    <td>
                      {(edit && (
                        <input
                          type="number"
                          onChange={handleChange}
                          placeholder={data && data[0].productionYear}
                          name="productionYear"
                        />
                      )) ||
                        data[0].productionYear}
                    </td>
                    <td className="auction__first-row">Typ paliwa</td>
                    <td>
                      {(edit && (
                        <select name="fuelType" onChange={handleChange}>
                          <option selected disabled>
                            Wybierz rodzaj paliwa
                          </option>
                          <option
                            selected={data && data[0].fuelType === "benzyna"}
                            value="benzyna"
                          >
                            Benzyna
                          </option>
                          <option
                            selected={data && data[0].fuelType === "diesel"}
                            value="diesel"
                          >
                            Diesel
                          </option>
                        </select>
                      )) ||
                        data[0].fuelType}
                    </td>
                  </tr>
                  <tr>
                    <td className="auction__first-row">Przebieg</td>
                    <td>
                      {(edit && (
                        <input
                          type="number"
                          placeholder={data && data[0].mileage}
                          onChange={handleChange}
                          name="mileage"
                        />
                      )) ||
                        data[0].mileage}
                    </td>
                    <td className="auction__first-row">Kolor</td>
                    <td>
                      {(edit && (
                        <input
                          type="text"
                          placeholder={data && data[0].color}
                          onChange={handleChange}
                          name="color"
                        />
                      )) ||
                        data[0].color}
                    </td>
                  </tr>
                  <tr>
                    <td className="auction__first-row">Pojemność</td>
                    <td>
                      {(edit && (
                        <input
                          type="number"
                          placeholder={data && data[0].capacity}
                          onChange={handleChange}
                          name="capacity"
                        />
                      )) ||
                        data[0].capacity}
                    </td>
                    <td className="auction__first-row">VIN</td>
                    <td>
                      {(edit && (
                        <input
                          type="number"
                          placeholder={data && data[0].vin}
                          onChange={handleChange}
                          name="vin"
                        />
                      )) ||
                        data[0].vin}
                    </td>
                  </tr>
                  <tr>
                    <td className="auction__first-row">Skrzynia biegów</td>
                    <td>
                      {(edit && (
                        <select name="transmission" onChange={handleChange}>
                          <option selected disabled>
                            Skrzynia biegów
                          </option>
                          <option
                            selected={
                              data && data[0].transmission === "automatyczna"
                            }
                            value="automatyczna"
                          >
                            Automatyczna
                          </option>
                          <option
                            selected={
                              data && data[0].transmission === "manualna"
                            }
                            value="manualna"
                          >
                            Manualna
                          </option>
                        </select>
                      )) ||
                        data[0].transmission}
                    </td>
                    <td className="auction__first-row">Typ nadwozia</td>
                    <td>
                      {(edit && (
                        <select name="bodyStyle" onChange={handleChange}>
                          <option selected disabled>
                            Wybierz typ nadwozia
                          </option>
                          <option
                            selected={data && data[0].bodyStyle === "coupe"}
                            value="coupe"
                          >
                            Copue
                          </option>
                          <option
                            selected={data && data[0].bodyStyle === "sedan"}
                            value="sedan"
                          >
                            Sedan
                          </option>
                          <option
                            selected={data && data[0].bodyStyle === "combi"}
                            value="combi"
                          >
                            Combi
                          </option>
                          <option
                            selected={data && data[0].bodyStyle === "suv"}
                            value="suv"
                          >
                            Suv
                          </option>
                        </select>
                      )) ||
                        data[0].bodyStyle}
                    </td>
                  </tr>
                  <tr>
                    <td className="auction__first-row">Kolor wnętrza</td>
                    <td>
                      {(edit && (
                        <input
                          type="text"
                          placeholder={data && data[0].interiorColor}
                          onChange={handleChange}
                          name="interiorColor"
                        />
                      )) ||
                        data[0].interiorColor}
                    </td>
                    <td className="auction__first-row">Typ sprzedawcy</td>
                    <td>
                      {(edit && (
                        <select name="sellerType" onChange={handleChange}>
                          <option selected disabled>
                            Wybierz typ sprzedawcy
                          </option>
                          <option
                            selected={data && data[0].sellerType === "prywatny"}
                            value="prywatny"
                          >
                            Prywatny
                          </option>
                          <option
                            selected={data && data[0].sellerType === "firma"}
                            value="firma"
                          >
                            Firma
                          </option>
                        </select>
                      )) ||
                        data[0].sellerType}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="auction__description">
                <h1>Opis Auta</h1>

                {(edit && (
                  <textarea
                    placeholder={data && data[0].description}
                    name="description"
                    // value=
                    maxLength="300"
                    onChange={handleChange}
                  />
                )) || <p>{data[0].description}</p>}
              </div>
              <div className="auction__highlights">
                <h1>Najważniejsze informacje</h1>
                {edit && (
                  <label for="highlightInput">
                    <input id="highlightInput" name="highlights" type="text" />
                    <button
                      id="highlightInput"
                      className="auction__bottom-items-button"
                      type="button"
                      onClick={highlightsAdd}
                    >
                      Dodaj
                    </button>
                  </label>
                )}
                <ul>
                  {inputs.highlights &&
                    inputs.highlights.map((item) => {
                      return <li onClick={removeHighlights}>{item}</li>;
                    })}
                </ul>
              </div>
              <div className="auction__equipment">
                <h1>Wyposażenie</h1>
                {edit && (
                  <label for="equipmentInput">
                    <input id="equipmentInput" name="equipment" type="text" />
                    <button
                      id="equipmentInput"
                      type="button"
                      className="auction__bottom-items-button"
                      onClick={equipmentAdd}
                    >
                      Dodaj
                    </button>
                  </label>
                )}
                <ul>
                  {inputs.equipment &&
                    inputs.equipment.map((item) => {
                      return <li onClick={removeEquipment}>{item}</li>;
                    })}
                </ul>
              </div>
              <div className="auction__flaws">
                <h1>Wady</h1>
                {edit && (
                  <label for="flawsInput">
                    <input id="flawsInput" name="flaws" type="text" />
                    <button
                      className="auction__bottom-items-button"
                      id="flawsInput"
                      type="button"
                      onClick={flawsAdd}
                    >
                      Dodaj
                    </button>
                  </label>
                )}
                <ul>
                  {inputs.flaws &&
                    inputs.flaws.map((item) => {
                      return <li onClick={removeFlaws}>{item}</li>;
                    })}
                </ul>
              </div>
              {edit && data[0].userId === userId && (
                <button onClick={handleUpdate} className="auction__edit-button">
                  Zapisz zmiany
                </button>
              )}
            </div>
            <NewListings />
          </div>
        </div>
      </div>
    );
  }
};

export default Auction;
