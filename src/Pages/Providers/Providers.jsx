import React, { useEffect, useState } from "react";
import "./Providers.css";
import api from "../../Shared/API/api";

const Providers = () => {
  const [providersData, setProvidersData] = useState([]);
  const [providerDetailVisible, setProviderDetailVisible] = useState(false);
  const [providerSelected, setProviderSelected] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [isNew, setIsNew] = useState(false);

  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();
  const [address, setAddress] = useState();
  const [cityCode, setCityCode] = useState();
  const [city, setCity] = useState();
  const [country, setCountry] = useState();
  const [observation, setObservation] = useState();
  const [TaxIdentificationNumber, setTaxIdentificationNumber] = useState();
  const [shipmentFree, setShipmentFree] = useState();

  useEffect(() => {
    getProviders();
  }, []);

  const getProviders = () => {
    api
      .get("/providers")
      .then((response) => {
        setProvidersData(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const btnClose = () => {
    setProviderDetailVisible(false);
    setIsEdit(false);
    setIsNew(false);
  };

  return (
    <div className="provider">
      <h1>PROVEÏDORS</h1>
      <div className="provider-container">
        {providersData &&
          providersData.length > 0 &&
          providersData.map((item, index) => (
            <div
              key={index}
              className="provider-container_item link"
              onClick={() => {
                setProviderSelected(item);
                setProviderDetailVisible(true);
              }}
            >
              <p>{item.name}</p>
              <p>email: {item.email}</p>
              <p>telf: {item.phone}</p>
            </div>
          ))}
      </div>
      <h2
        className="link"
        onClick={() => {
          setIsNew(true);
          setProviderDetailVisible(true);
        }}
      >
        NOU PROVEÏDOR
      </h2>
      {providerDetailVisible && (
        <div className="">
          {isEdit || isNew ? (
            <div className="provider-detail-container">
            <div>
            <button className="link provider_detail_button">Guardar</button>
            <button
              className="link provider_detail_button"
              onClick={() => {
                btnClose();
              }}
            >
              Tancar
            </button>
            </div>
        
              {isNew ? <h1>NOU PROVEÏDOR</h1> : <h1>MODIFICAR PROVEÏDOR</h1>}
              <input
                defaultValue={!isNew ? providerSelected.name : ""}
                placeholder="Proveïdor"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className="text_input"
              />
              <input
                defaultValue={!isNew ? providerSelected.email : ""}
                placeholder="Email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className="text_input"
              />
              <input
                defaultValue={!isNew ? providerSelected.phone : ""}
                placeholder="Teléfon"
                onChange={(e) => {
                  setPhone(e.target.value);
                }}
                className="text_input"
              />
              <input
                defaultValue={!isNew ? providerSelected.address : ""}
                placeholder="Adreça"
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
                className="text_input"
              />
              <input
                defaultValue={!isNew ? providerSelected.cityCode : ""}
                placeholder="CP"
                onChange={(e) => {
                  setCityCode(e.target.value);
                }}
                className="text_input"
              />
              <input
                defaultValue={!isNew ? providerSelected.city : ""}
                placeholder="Població"
                onChange={(e) => {
                  setCity(e.target.value);
                }}
                className="text_input"
              />
              <input
                defaultValue={!isNew ? providerSelected.country : ""}
                placeholder="País"
                onChange={(e) => {
                  setCountry(e.target.value);
                }}
                className="text_input"
              />
              <input
                defaultValue={!isNew ? providerSelected.observation : ""}
                placeholder="Observacions"
                onChange={(e) => {
                  setObservation(e.target.value);
                }}
                className="text_input"
              />
              <label>
                enviament Gratuït:
                <input
                  type="checkbox"
                  defaultChecked={
                    !isNew
                      ? providerSelected.shipmentFree
                        ? true
                        : false
                      : false
                  }
                  onChange={(e) => {
                    setShipmentFree(e.target.value);
                  }}
                />
              </label>
            </div>
          ) : (
            <div className="provider-detail-container">
              <button
                className="link provider_detail_button"
                onClick={() => {
                  setIsEdit(true);
                }}
              >
                Editar
              </button>
              <button
                className="link provider_detail_button"
                onClick={() => {
                  btnClose();
                }}
              >
                Tancar
              </button>
              <h1>{providerSelected.name}</h1>

              <p>Email: {providerSelected.email}</p>
              <p>Teléfon: {providerSelected.phone}</p>
              <p>Adreça: {providerSelected.address}</p>
              <p>CP: {providerSelected.cityCode}</p>
              <p>Població: {providerSelected.city}</p>
              <p>País: {providerSelected.country}</p>
              <p>Observacions: {providerSelected.observation}</p>
              <p>IsEdit: {isEdit.toString()}</p>
              <label>
                enviament Gratuït:
                <input
                  type="checkbox"
                  checked={providerSelected.shipmentFree ? true : false}
                  readOnly
                />
              </label>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Providers;
