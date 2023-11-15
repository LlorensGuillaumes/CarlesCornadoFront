import React, { useEffect, useState } from "react";
import "./Providers.css";
import api from "../../Shared/API/api";
import agregar from '../../Images/icons/agregar.png';
import cancelar from '../../Images/icons/cancelar.png';
import papelera from '../../Images/icons/papelera.png';
import editar from '../../Images/icons/editar.png';
import TreatyArray from "../../Shared/TreatyArray/Treatyarray";
import irA from "../../Shared/ScrollTo/scroll";

const Providers = () => {
  const [providersData, setProvidersData] = useState([]);
  const [providerDetailVisible, setProviderDetailVisible] = useState(false);
  const [providerSelected, setProviderSelected] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const [isNew, setIsNew] = useState(false);

  const [providerName, setProviderName]=useState();
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

  const getProviders = () => {
    api
      .get("/providers")
      .then((response) => {
        setProvidersData(TreatyArray.alphabetical(response, 'name'));
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

  const saveProvider = (drop = false) =>{
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
    console.log(newProvider)

    if(drop){
      api.delete(`/providers/delete/${providerSelected._id}`)
      .then((response)=>{
        getProviders()
        btnClose()
      })
    }
    if(isNew){
      api.post('/providers/create', newProvider)
      .then((response)=>{
        getProviders()
        btnClose()
      })
    }

    if(isEdit){
      api.put(`/providers/edit/${providerSelected._id}`)
      .then((responsse)=>{
        getProviders()
        btnClose()
      })
    }
  }
  return (
    <div className="provider">
      <h1>PROVEÏDORS</h1>
      <div className="optionBtn link" onClick={()=>{
        setIsNew(true)
        setProviderDetailVisible(true)
      }}>
      <img src={agregar} alt="Nou proveidor" title="Nou Provïdor"/>
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
                irA.top()
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
            <div>
            
            </div>
        
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
              defaultValue={!isNew ? providerSelected.TaxIdentificationNumber : ""}
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
                    :false
                  }
                  onChange={(e) => {
                    setShipmentFree(e.target.checked);
                  }}
                />
              </label>
              <button className="link provider_detail_button" onClick={()=>{saveProvider()}}>Guardar</button>
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
              onClick={()=>{
                setIsEdit(true)
              }}/>
              </div>
              <div className="optionBtn">
              <img 
              src={cancelar} 
              alt="Cancelar" 
              title="Cancelar" 
              className='link' 
              onClick={()=>{
                btnClose()
              }}/>
              </div>
              <div className="optionBtn">
              <img 
              src={papelera} 
              alt="Eliminar" 
              title="Eliminar" 
              className='link' 
              onClick={()=>{
                saveProvider(true)
              }}/>
              </div>
              
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Providers;
