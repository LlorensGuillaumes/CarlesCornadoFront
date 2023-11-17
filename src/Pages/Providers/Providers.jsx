import React, { useEffect, useState } from "react";
import "./Providers.css";
import api from "../../Shared/API/api";
import agregar from "../../Images/icons/agregar.png";
import cancelar from "../../Images/icons/cancelar.png";
import papelera from "../../Images/icons/papelera.png";
import editar from "../../Images/icons/editar.png";
import order from "../../Images/icons/order.png";
import guardar from "../../Images/icons/guardar.png";
import TreatyArray from "../../Shared/TreatyArray/Treatyarray";
import irA from "../../Shared/ScrollTo/scroll";

const Providers = () => {
  const [providersData, setProvidersData] = useState([]);
  const [suppliesProviderData, setSuppliesProviderData] = useState([]);
  const [providerDetailVisible, setProviderDetailVisible] = useState(false);
  const [purchaseOrderVisible, setPurchaseOrderVisible] = useState(false);
  const [addVisible, setAddVisible] = useState({
    key: null,
    units: 0,
    id: null,
  });
  const [providerSelected, setProviderSelected] = useState();
  const [purchaseOrderItems, setPurchaseOrderItems] = useState([]);
  const [purchaseOrderTotal, setPurchaseOrderTotal] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [isNew, setIsNew] = useState(false);

  const [providerName, setProviderName] = useState();
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();
  const [address, setAddress] = useState();
  const [cityCode, setCityCode] = useState();
  const [city, setCity] = useState();
  const [country, setCountry] = useState();
  const [observation, setObservation] = useState();
  const [TaxIdentificationNumber, setTaxIdentificationNumber] = useState();
  const [shipmentFree, setShipmentFree] = useState(false);

  useEffect(() => {
    getProviders();
  }, []);

  useEffect(()=>{
    let total = 0;
    

    for (const item of purchaseOrderItems) {
      const subTotal = item.price * item.units; 
      total = total + subTotal;
      
    };
  setPurchaseOrderTotal(total);

  },[purchaseOrderItems])

  const getProviders = () => {
    api
      .get("/providers")
      .then((response) => {
        setProvidersData(TreatyArray.alphabetical(response, "name"));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getSuppliesProviders = () => {
    api
      .get(`/provisioning/provider/${providerSelected._id}`)
      .then((response) => {
        console.log(response);
        setSuppliesProviderData(
          TreatyArray.alphabetical(response, "description")
        );
      });
  };
  const btnClose = () => {
    setProviderDetailVisible(false);
    setIsEdit(false);
    setIsNew(false);
  };

  const saveProvider = (drop = false) => {
    const newProvider = {
      name: providerName,
      taxIdentificationNumber: TaxIdentificationNumber,
      country: country,
      city: city,
      cityCode: cityCode,
      address: address,
      phone: phone,
      email: email,
      shipmentFree: shipmentFree,
      observation: observation,
    };
    console.log(newProvider);

    if (drop) {
      api
        .delete(`/providers/delete/${providerSelected._id}`)
        .then((response) => {
          getProviders();
          btnClose();
        });
    }
    if (isNew) {
      api.post("/providers/create", newProvider).then((response) => {
        getProviders();
        btnClose();
      });
    }

    if (isEdit) {
      api.put(`/providers/edit/${providerSelected._id}`).then((responsse) => {
        getProviders();
        btnClose();
      });
    }
  };

  const fnChangeUtis = (index, value, item) => {
    {
      value >= 0
        ? setAddVisible({ key: index, units:value, id:item })
        : setAddVisible({ key: null, units: value, id: item });
    }
  };
  console.log(addVisible)
  const fnAddSuply = () => {
    const newItem = {
      id: addVisible.id._id,
      units: addVisible.units,
      price: addVisible.id.price,
      code: addVisible.id.code,
      name: addVisible.id.description,
    };

    const purchaseItemsNotActual = purchaseOrderItems.filter(
      (item) => item.id !== newItem.id
    );
    setPurchaseOrderItems([...purchaseItemsNotActual, newItem]);

  };

  const fnSaveOrder = () =>{
    const actualDate = new Date();
    const day = actualDate.getDate();
    const month = actualDate.getMonth() + 1;
    const year = actualDate.getFullYear();
    const hour = actualDate.getHours();
    const minute = actualDate.getMinutes();

    const formatYear = year.toString().slice(-2);
    const formatDay = day < 10 ? `0${day}` : day;
    const formatMonth = month < 10 ? `0${month}` : month;
    const formatHour = hour < 10 ? `0${hour}` : hour;
    const formatMinute = minute < 10 ? `0${minute}` : minute;

    const ordenNumber = `${formatYear}${formatMonth}${formatDay}${formatHour}${formatMinute}`;
    const provisioningItems = [];
    for (const item of purchaseOrderItems) {
      const provisioning = {
        idSuply: item.id,
        units: parseInt(item.units),
        price: parseInt(item.price),
      }
      if(provisioning.units !== 0){
        provisioningItems.push(provisioning);
      }
      
    }
    const newOrder = {
      orderNumber: ordenNumber,
      idProvider: providerSelected._id,
      provisioning: provisioningItems,
    }
    console.log(newOrder)

    api.post('/purchases/create', newOrder)
      .then((response)=>console.log(response))
  }
console.log(purchaseOrderItems)
  return (
    <div className="provider">
      <h1>PROVEÏDORS</h1>
      <div
        className="optionBtn link"
        onClick={() => {
          setIsNew(true);
          setProviderDetailVisible(true);
        }}
      >
        <img src={agregar} alt="Nou proveidor" title="Nou Provïdor" />
      </div>
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
                irA.top();
              }}
            >
              <p>{item.name}</p>
              <p>email: {item.email}</p>
              <p>telf: {item.phone}</p>
            </div>
          ))}
      </div>
      {providerDetailVisible && (
        <div className="">
          {isEdit || isNew ? (
            <div className="provider-detail-container">
              <div></div>

              {isNew ? <h1>NOU PROVEÏDOR</h1> : <h1>MODIFICAR PROVEÏDOR</h1>}
              <input
                defaultValue={!isNew ? providerSelected.name : ""}
                placeholder="Proveïdor"
                onChange={(e) => {
                  setProviderName(e.target.value);
                }}
                className="text_input"
              />
              <input
                defaultValue={
                  !isNew ? providerSelected.TaxIdentificationNumber : ""
                }
                placeholder="NIF - CIF"
                onChange={(e) => {
                  setTaxIdentificationNumber(e.target.value);
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
                    setShipmentFree(e.target.checked);
                  }}
                />
              </label>
              <button
                className="link provider_detail_button"
                onClick={() => {
                  saveProvider();
                }}
              >
                Guardar
              </button>
              <button
                className="link provider_detail_button"
                onClick={() => {
                  btnClose();
                }}
              >
                Tancar
              </button>
            </div>
          ) : (
            <div className="provider-detail-container">
              <h1>{providerSelected.name}</h1>
              <div className="optionBtn">
                <img
                  className="link"
                  src={order}
                  alt="Ordre de compra"
                  title="Ordre de compra"
                  onClick={() => {
                    setPurchaseOrderVisible(true);
                    getSuppliesProviders();
                  }}
                />
              </div>
              <p>NIF - CIF: {providerSelected.taxIdentificationNumber}</p>
              <p>Email: {providerSelected.email}</p>
              <p>Teléfon: {providerSelected.phone}</p>
              <p>Adreça: {providerSelected.address}</p>
              <p>CP: {providerSelected.cityCode}</p>
              <p>Població: {providerSelected.city}</p>
              <p>País: {providerSelected.country}</p>
              <p>Observacions: {providerSelected.observation}</p>
              <label>
                enviament Gratuït:
                <input
                  type="checkbox"
                  checked={providerSelected.shipmentFree ? true : false}
                  readOnly
                />
              </label>

              <div className="optionBtn">
                <img
                  src={editar}
                  alt="Editar"
                  title="Editar"
                  className="link"
                  onClick={() => {
                    setIsEdit(true);
                  }}
                />
              </div>
              <div className="optionBtn">
                <img
                  src={cancelar}
                  alt="Cancelar"
                  title="Cancelar"
                  className="link"
                  onClick={() => {
                    btnClose();
                  }}
                />
              </div>
              <div className="optionBtn">
                <img
                  src={papelera}
                  alt="Eliminar"
                  title="Eliminar"
                  className="link"
                  onClick={() => {
                    saveProvider(true);
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}
      {purchaseOrderVisible && (
        <div className="purchase_order-container">
          <h1>CREAR ORDRE DE COMPRA</h1>
          <p>{providerSelected.name}</p>
          {suppliesProviderData &&
            suppliesProviderData.length > 0 &&
            suppliesProviderData.map((item, index) => (
              <div key={index} className="purchase_order-item">
                <p className="purchase_supply-code">{item.code}</p>
                <p className="purchase_supply-description">
                  {item.description}
                </p>
                <p className="purchase_supply-price">{item.price} €</p>
                <input
                  className="purchase_supply-units"
                  type="number"
                  min={0}
                  defaultValue={0}
                  onChange={(e) => fnChangeUtis(index, e.target.value, item)}
                />

                {addVisible && addVisible.key === index && (
                  <div className="optionBtn link">
                    <img
                      src={agregar}
                      alt="Afegir"
                      title="Afegir"
                      onClick={() => {
                        fnAddSuply();
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          <div className="optionBtn link">
            <img
              src={cancelar}
              alt="Cancelar"
              title="Cancelar"
              onClick={() => {
                setPurchaseOrderVisible(false);
              }}
            />
          </div>
          <div>
          <h1>ORDRE DE COMPRA</h1>
          <div className="optionBtn">
          <img 
          className="link"
          src={guardar} 
          alt="Guardar" 
          title="Guardar" 
          onClick={()=>{
            fnSaveOrder()
          }}/>
          </div>
          {purchaseOrderTotal && purchaseOrderTotal > 0 && <p>Import ordre de compra: {purchaseOrderTotal} €</p>}
          {purchaseOrderItems && purchaseOrderItems.length > 0 && purchaseOrderItems.map((item, index)=>(
            <div key={index} className="purchase_order-item">
            <p className="purchase_supply-code">{item.code}</p>
            <p className="purchase_supply-description">{item.name}</p>
            <p className="purchase_supply-price">{item.price} €/u.</p>
            <p className="purchase_supply-units-detail">{item.units} u</p>
            <p className="purchase_supply-price">{item.units * item.price} €</p>

            </div>
          ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default Providers;
