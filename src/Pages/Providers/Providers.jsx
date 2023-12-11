import React, { useEffect, useState } from "react";
import "./Providers.css";
import api from "../../Shared/API/api";
import agregar from "../../Images/icons/agregar.png";
import cancelar from "../../Images/icons/cancelar.png";
import aceptar from "../../Images/icons/aceptar.png";
import papelera from "../../Images/icons/papelera.png";
import editar from "../../Images/icons/editar.png";
import order from "../../Images/icons/order.png";
import guardar from "../../Images/icons/guardar.png";
import TreatyArray from "../../Shared/TreatyArray/Treatyarray";
import irA from "../../Shared/ScrollTo/scroll";
import DeleteConfirm from "../DeleteConfirm/DeleteConfirm";

const Providers = () => {
  const [providersData, setProvidersData] = useState([]);
  const [suppliesProviderData, setSuppliesProviderData] = useState([]);
  const [componentsProvidersData, setComponentsProvidersData] = useState([]);
  const [productsProvidersData, setProductsProvidersData] = useState([]);
  const [processesProvidersData, setProcessesProviderData] = useState([]);
  const [providerDetailVisible, setProviderDetailVisible] = useState(false);
  const [purchaseOrderVisible, setPurchaseOrderVisible] = useState(false);
  const [groupSelected, setGroupSelected] = useState("1");
  const [showConfirm, setShowConfirm] = useState(false);
  const [addVisible, setAddVisible] = useState({
    key: null,
    units: 0,
    id: null,
  });
  const [purchaseSendObservations, setPurchaseSendObservations] = useState([]);
  const [providerSelected, setProviderSelected] = useState();
  const [purchaseOrderItems, setPurchaseOrderItems] = useState([]);
  const [purchaseOrderTotal, setPurchaseOrderTotal] = useState(0);
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
  const [sendObservations, setSendObservations] = useState("");
  const [sendObservationsList, setSendObservationsList] = useState([]);
  const [TaxIdentificationNumber, setTaxIdentificationNumber] = useState();
  const [shipmentFree, setShipmentFree] = useState(false);
  const [currency, setCurrency] = useState("€");
  const [language, setLanguage] = useState("Català");
  const [familyComponents, setFamilyComponents] = useState(true);
  const [familyProducts, setFamilyProducts] = useState(true);
  const [familyProvisioning, setFamilyProvisioning] = useState(true);
  const [familyProcesses, setFamilyProcesses] = useState(true);
  const [findPrice, setFindPrice] = useState();

  useEffect(() => {
    getProviders();
  }, []);

  useEffect(() => {
    let total = 0;

    for (const item of purchaseOrderItems) {
      const subTotal = item.price * item.units;
      total = total + subTotal;
    }
    setPurchaseOrderTotal(parseInt(total));
  }, [purchaseOrderItems]);

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

  useEffect(() => {
    if (providerSelected) {
      setSendObservationsList(providerSelected.sendObservations);
    }
  }, [providerSelected]);

  const getSuppliesProviders = () => {
    api
      .get(`/provisioning/provider/${providerSelected._id}`)
      .then((response) => {
        const provisioningProvider = (response.map(item => {
          const providersFiltrados = item.providers.filter(provider => provider.idProvider._id === providerSelected._id);
          return {
            _id:item._id,
            code: item.code,
            description: item.description,
            providers: providersFiltrados
          };
        }).filter(item => item.providers.length > 0))
        setSuppliesProviderData(
          TreatyArray.alphabetical(provisioningProvider, "description")
        );
      });
  };

  const getComponentsProviders = () => {
    api.get(`/components/provider/${providerSelected._id}`).then((response) => {
      setComponentsProvidersData(
        TreatyArray.alphabetical(response, "description")
      );
    });
  };
  const getProductsProviders = () => {
    api.get(`/products/provider/${providerSelected._id}`).then((response) => {
      setProductsProvidersData(response);
    });
  };

  const getProcessesProviders = () => {
    api.get(`/processes/provider/${providerSelected._id}`).then((response) => {
      setProcessesProviderData(response);
    });
  };

  const btnClose = () => {
    setProviderDetailVisible(false);
    setIsEdit(false);
    setIsNew(false);
    setFamilyComponents(true);
    setFamilyProducts(true);
    setFamilyProvisioning(true);
    setFamilyProcesses(true);
  };

  const fnChangeGroupSelected = (option) => {
    setGroupSelected(option);
  };
  useEffect(() => {
    if (
      !familyComponents &&
      !familyProcesses &&
      !familyProducts &&
      !familyProvisioning
    ) {
      setFamilyComponents(true);
      setFamilyProcesses(true);
      setFamilyProducts(true);
      setFamilyProvisioning(true);
    }
  }, [familyComponents, familyProcesses, familyProducts, familyProvisioning]);

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
      sendObservations: sendObservationsList,
      language: language,
      currency: currency,
      family: {
        components: familyComponents,
        products: familyProducts,
        provisioning: familyProvisioning,
        processes: familyProcesses,
      },
    };

    if (drop) {
      setShowConfirm(true);
    }

    if (isNew) {
      api.post("/providers/create", newProvider).then((response) => {
        getProviders();
        btnClose();
      });
    }

    if (isEdit) {
      api
        .put(`/providers/edit/${providerSelected._id}`, newProvider)
        .then((responsse) => {
          getProviders();
          btnClose();
        });
    }
  };

  const dropProvider = (confirm) => {
    if (confirm) {
      api.put(`/providers/delete/${providerSelected._id}`).then((response) => {
        getProviders();
        btnClose();
      });
    }
    setShowConfirm(false);
  };
  const fnChangeUnits = (index, value, item) => {
    if (groupSelected === '1'){
      const actualProvider = item.providers.find((provider)=>(provider.idProvider._id === providerSelected._id))
      setFindPrice(actualProvider.price)
    }
    if (groupSelected === '3'){
      const actualProvider = item.providers.find((provider)=>(provider.providers === providerSelected._id))
      // setFindPrice(actualProvider.priceSale)
    }
    
    {
      value >= 0
        ? setAddVisible({ key: index, units: value, id: item })
        : setAddVisible({ key: null, units: value, id: item });
    }
  };
  const fnAddSuply = () => {
    const newItem = {
      id: addVisible.id._id,
      units: addVisible.units,
      price: groupSelected === '1' 
          ? findPrice
          : groupSelected === '2'
          ? addVisible.id.priceSale
          : groupSelected === '3'
          ? addVisible.id.priceSale
          : groupSelected === '4'
          ? addVisible.id.priceSale
          :"",
      code:
        groupSelected === "1"
          ? addVisible.id.code
          : groupSelected === "2"
          ? addVisible.id.componentReference
          : groupSelected === "3"
          ? addVisible.id.productReference
          : "",
      name: addVisible.id.description,
      type:
        groupSelected === "1"
          ? "provisioning"
          : groupSelected === "2"
          ? "components"
          : groupSelected === "3"
          ? "products"
          : "",
    };

    const purchaseItemsNotActual = purchaseOrderItems.filter(
      (item) => item.id !== newItem.id
    );
    setPurchaseOrderItems([...purchaseItemsNotActual, newItem]);
  };
  const fnSaveOrder = () => {
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
        type: item.type,
      };
      if (provisioning.units !== 0) {
        provisioningItems.push(provisioning);
      }
    }
    const newOrder = {
      orderNumber: ordenNumber,
      idProvider: providerSelected._id,
      provisioning: provisioningItems,
      sendObservations: purchaseSendObservations,
    };
    api.post("/purchases/create", newOrder).then((response) => response);
  };

  const fnAddSendObservation = (sendObservation, isChecked) => {
    if (isChecked) {
      setPurchaseSendObservations((prev) => [...prev, sendObservation]);
    } else {
      const sendObservationsWithoutSendObservation =
        purchaseSendObservations.filter((item) => item !== sendObservation);
      setPurchaseSendObservations(sendObservationsWithoutSendObservation);
    }
  };

  const fnSelectProvider = (provider) => {
    setProviderSelected(provider);
    setPurchaseOrderItems([]);
    if(provider.family){
      setFamilyComponents(provider.family.components);
      setFamilyProcesses(provider.family.processes);
      setFamilyProducts(provider.family.products);
      setFamilyProvisioning(provider.family.provisioning);
    } else {
      
    }
  }
  return (
    <div className="provider">
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
          providersData
          .filter(provider => !provider.idDeleted)
          .map((item, index) => (
            <div
              key={index}
              className="provider-container_item link"
              onClick={() => {
                fnSelectProvider(item);
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
              {isNew ? <h1>NOU PROVEÏDOR</h1> : <h1>MODIFICAR PROVEÏDOR</h1>}
              <div className="buttons-box">
              <div>
              <img 
              className="link"
              src={guardar} 
              alt="Guardar" 
              title="Guardar"
              onClick={() => {
                saveProvider();
              }}
              />
              </div>
              <div>
              <img 
              className="link"
              src={cancelar} 
              alt="Cancelar" 
              title="Cancelar"
              onClick={() => {
                btnClose();
              }}
              />
              </div>
              </div>
              <div className="providers_families">
                <h3>Families</h3>
                <div className="providers_families-group">
                  <div className="providers_families-item">
                    <input
                      type="checkbox"
                      checked={
                        familyProvisioning
                      }
                      onChange={(e) => {
                        setFamilyProvisioning(e.target.checked);
                      }}
                    />
                    <p className="providers_families-item-text">
                      Aprovisionaments
                    </p>
                  </div>
                  <div className="providers_families-item">
                    <input
                      type="checkbox"
                      checked={
                          familyComponents
                      }
                      onChange={(e) => {
                        setFamilyComponents(e.target.checked);
                      }}
                    />
                    <p className="providers_families-item-text">Components</p>
                  </div>
                  <div className="providers_families-item">
                    <input
                      type="checkbox"
                      checked={
                        familyProducts
                      }
                      onChange={(e) => {
                        setFamilyProducts(e.target.checked);
                      }}
                    />
                    <p className="providers_families-item-text">Productes</p>
                  </div>
                  <div className="providers_families-item">
                    <input
                      type="checkbox"
                      checked={
                        familyProcesses
                      }
                      onChange={(e) => {
                        setFamilyProcesses(e.target.checked);
                      }}
                    />
                    <p className="providers_families-item-text">Processos</p>
                  </div>
                </div>
              </div>
              <div className="onLineText">
              <input
                defaultValue={!isNew ? providerSelected.name : ""}
                placeholder="Proveïdor"
                onChange={(e) => {
                  setProviderName(e.target.value);
                }}
                className="text_input name_input"
              />
              <input
                defaultValue={
                  !isNew ? providerSelected.TaxIdentificationNumber : ""
                }
                placeholder="NIF - CIF"
                onChange={(e) => {
                  setTaxIdentificationNumber(e.target.value);
                }}
                className="text_input cif_input"
              />
              
              </div>
              
              <input
                defaultValue={!isNew ? providerSelected.email : ""}
                placeholder="Email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className="text_input email_input"
              />
              <input
                defaultValue={!isNew ? providerSelected.phone : ""}
                placeholder="Teléfon"
                onChange={(e) => {
                  setPhone(e.target.value);
                }}
                className="text_input phone_input"
              />
              <input
                defaultValue={!isNew ? providerSelected.address : ""}
                placeholder="Adreça"
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
                className="text_input address_input"
              />
              <div className="onLineText">
              <input
                defaultValue={!isNew ? providerSelected.cityCode : ""}
                placeholder="CP"
                onChange={(e) => {
                  setCityCode(e.target.value);
                }}
                className="text_input cp_input"
              />
              <input
                defaultValue={!isNew ? providerSelected.city : ""}
                placeholder="Població"
                onChange={(e) => {
                  setCity(e.target.value);
                }}
                className="text_input city_input"
              />
              <input
                defaultValue={!isNew ? providerSelected.country : ""}
                placeholder="País"
                onChange={(e) => {
                  setCountry(e.target.value);
                }}
                className="text_input country_input"
              />
              </div>
              
              <label className="shipmentFree_input">
                Enviament Gratuït:
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
              <div className="onLineText">
              <select
              className="select_input"
              defaultValue={providerSelected ? providerSelected.language : ''}
                onChange={(e) => {
                  setLanguage(e.target.value);
                }}
              >
                <option>Selecciona idioma</option>
                <option>Català</option>
                <option>Anglès</option>
              </select>
              <select 
              className="select_input currency_input"
              defaultValue={providerSelected ? providerSelected.currency : ''}
              onChange={(e) => setCurrency(e.target.value)}>
                <option>Moneda</option>
                <option>€</option>
                <option>$</option>
                <option>CHF</option>
              </select>
              
              </div>
              
              <input
                defaultValue={!isNew ? providerSelected.observation : ""}
                placeholder="Observacions"
                onChange={(e) => {
                  setObservation(e.target.value);
                }}
                className="text_input observations_input"
              />
              <div className="onLineText">
              <input
                defaultValue={!isNew ? providerSelected.observation : ""}
                placeholder="Observacions d'enviament"
                onChange={(e) => {
                  setSendObservations(e.target.value);
                }}
                className="text_input observations_input"
              />
              <div
                className="optionBtnList link"
                onClick={() => {
                  setSendObservationsList((prev) => [
                    ...prev,
                    sendObservations,
                  ]);
                }}
              >
                <img src={agregar} alt="Agregar" title="Afegir observació" />              
              </div>
              
              </div>
              {sendObservationsList &&
                sendObservationsList.length > 0 &&
                sendObservationsList.map((sendObservation, index) => (
                  <div key={index}>
                    <p>{sendObservation}</p>
                    <div
                      className="optionBtnList link"
                      onClick={() => {
                        setSendObservationsList(
                          sendObservationsList.filter(
                            (item) => item !== sendObservation
                          )
                        );
                      }}
                    >
                      <img src={papelera} alt="Eliminar" title="Eliminar" />
                    </div>
                  </div>
                ))}

 
            </div>
          ) : (
            <div className="provider-detail-container">
            <div className="buttons-box">
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
                className="link"
                src={order}
                alt="Ordre de compra"
                title="Ordre de compra"
                onClick={() => {
                  setPurchaseOrderVisible(true);
                  getSuppliesProviders();
                  getComponentsProviders();
                  getProductsProviders();
                  getProcessesProviders();
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
              <h1>{providerSelected.name}</h1>
              <div className="provider_detail-container">
                <p>NIF - CIF: {providerSelected.taxIdentificationNumber}</p>
                <p>Email: {providerSelected.email}</p>
                <p>Teléfon: {providerSelected.phone}</p>
                <p>Adreça: {providerSelected.address}</p>
                <p>
                  Població: {providerSelected.cityCode} {providerSelected.city}{" "}
                  ({providerSelected.country})
                </p>
                <p>Observacions: {providerSelected.observation}</p>
                <div>
                </div>
                <div className="providers_families">
                <h3>Families</h3>
                <div className="providers_families-group">
                  <div className="providers_families-item">
                    {providerSelected.family.provisioning && <p className="providers_families-item-text">Aprovisionaments</p>}
                  </div>
                  <div className="providers_families-item">
                    {providerSelected.family.components && <p className="providers_families-item-text">Components</p>}
                  </div>
                  <div className="providers_families-item">
                  {providerSelected.family.products && <p className="providers_families-item-text">Productes</p>}
                  </div>
                  <div className="providers_families-item">
                  {providerSelected.family.processes && <p className="providers_families-item-text">Processos</p>}
                  </div>
                </div>
              </div>
                <div className="provider_options-detail">
                  <h3>Configuració</h3>
                  <div className="shipmentFree_item">
                    <p>Enviament Gratuït: </p>
                    <p>{providerSelected.shipmentFree ? "Si" : "No"}</p>
                  </div>
                  <p>Idioma: {providerSelected.language}</p>
                  <p>Moneda: {providerSelected.currency}</p>
                </div>
              </div>
              <div className="provider_options-detail">
                <h3>Observacions d'enviamet:</h3>
                {sendObservationsList &&
                  sendObservationsList.length > 0 &&
                  sendObservationsList.map((item, index) => (
                    <div key={index}>
                      <p>{item}</p>
                    </div>
                  ))}
              </div>

              {showConfirm && (
                <DeleteConfirm
                  text={providerSelected.name}
                  onAceptar={() => dropProvider(true)}
                  onCancelar={() => dropProvider(false)}
                />
              )}
            </div>
          )}
        </div>
      )}
      {purchaseOrderVisible && (
        <div className="purchase_order-container">
          <h1>CREAR ORDRE DE COMPRA</h1>
          <div className="buttons-box">
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
            <div className="optionBtn">
              <img
                className="link"
                src={guardar}
                alt="Guardar"
                title="Guardar"
                onClick={() => {
                  fnSaveOrder();
                  setPurchaseOrderVisible(false);
                }}
              />
            </div>
          </div>
          <h3>{providerSelected.name}</h3>
          <div className="sendOptions-box">
            <p>Observacions d'enviament</p>
            {providerSelected.sendObservations &&
              providerSelected.sendObservations.length > 0 &&
              providerSelected.sendObservations.map((item, index) => (
                <div key={index}>
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      fnAddSendObservation(item, e.target.checked);
                    }}
                  />
                  <p>{item}</p>
                </div>
              ))}
          </div>
          <div className="selectGroup">
          {suppliesProviderData && suppliesProviderData.length > 0 && 
            <label className="selectGroupItem">
              <input
                type="radio"
                value="1"
                checked={groupSelected === "1"}
                onChange={() => {
                  fnChangeGroupSelected("1");
                }}
              />
              Aprovisionaments
            </label>
          }

          {componentsProvidersData && componentsProvidersData.length > 0 &&
          <label className="selectGroupItem">
              <input
                type="radio"
                value="2"
                checked={groupSelected === "2"}
                onChange={() => {
                  fnChangeGroupSelected("2");
                }}
              />
              Components
            </label>
          }
            
          {productsProvidersData && productsProvidersData.length > 0 && 
          <label className="selectGroupItem">
              <input
                type="radio"
                value="3"
                checked={groupSelected === "3"}
                onChange={() => {
                  fnChangeGroupSelected("3");
                }}
              />
              Productes
            </label>
          }
          
          {processesProvidersData && processesProvidersData.length > 0 && 
          <label className="selectGroupItem">
              <input
                type="radio"
                value="4"
                checked={groupSelected === "4"}
                onChange={() => {
                  fnChangeGroupSelected("4");
                }}
              />
              Processos
            </label>
          }
            
          </div>

          {groupSelected === "1" &&
            suppliesProviderData &&
            suppliesProviderData.length > 0 &&
            suppliesProviderData.map((item, index) => (
              <div key={index} className="purchase_order-item">
                <p className="purchase_supply-code">{item.code}</p>
                <p className="purchase_supply-description">
                  {item.description}
                </p>
                <p className="purchase_supply-price">
                  {item.providers[0].price} {providerSelected.currency}
                </p>
                <input
                  className="purchase_supply-units"
                  type="number"
                  min={0}
                  defaultValue={0}
                  onChange={(e) => fnChangeUnits(index, e.target.value, item)}
                />

                {addVisible && addVisible.key === index && (
                  <div className="optionBtnList link">
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

          {groupSelected === "2" &&
            componentsProvidersData &&
            componentsProvidersData.length > 0 &&
            componentsProvidersData.map((item, index) => (
              <div key={index} className="purchase_order-item">
                <p className="purchase_supply-code">
                  {item.componentReference}
                </p>
                <p className="purchase_supply-description">
                  {item.description}
                </p>
                <p className="purchase_supply-price">
                  {item.priceSale} {providerSelected.currency}
                </p>
                <input
                  className="purchase_supply-units"
                  type="number"
                  min={0}
                  defaultValue={0}
                  onChange={(e) => fnChangeUnits(index, e.target.value, item)}
                />

                {addVisible && addVisible.key === index && (
                  <div className="optionBtnList link">
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

          {groupSelected === "3" &&
            productsProvidersData &&
            productsProvidersData.length > 0 &&
            productsProvidersData.map((item, index) => (
              <div key={index} className="purchase_order-item">
                <p className="purchase_supply-code">{item.productReference}</p>
                <p className="purchase_supply-description">
                  {item.description}
                </p>
                <p className="purchase_supply-price">
                  {item.priceSale} {providerSelected.currency}
                </p>
                <input
                  className="purchase_supply-units"
                  type="number"
                  min={0}
                  defaultValue={0}
                  onChange={(e) => fnChangeUnits(index, e.target.value, item)}
                />

                {addVisible && addVisible.key === index && (
                  <div className="optionBtnList link">
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

          {groupSelected === "4" &&
            processesProvidersData &&
            processesProvidersData.length > 0 &&
            processesProvidersData.map((item, index) => (
              <div key={index} className="purchase_order-item">
                <p className="purchase_supply-code">{item.productReference}</p>
                <p className="purchase_supply-description">{item.name}</p>
                <p className="purchase_supply-price">
                  {item.price} {providerSelected.currency}
                </p>
                <input
                  className="purchase_supply-units"
                  type="number"
                  min={0}
                  defaultValue={0}
                  onChange={(e) => fnChangeUnits(index, e.target.value, item)}
                />

                {addVisible && addVisible.key === index && (
                  <div className="optionBtnList link">
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

          <div>
            <h2>ORDRE DE COMPRA</h2>

            {purchaseOrderTotal && purchaseOrderTotal > 0 && (
              <h3>
                Import ordre de compra: {purchaseOrderTotal}{" "}
                {providerSelected.currency}
              </h3>
            )}
            <div className="purchase_order-item header-list">
              <p className="purchase_supply-code">codi</p>
              <p className="purchase_supply-description">nom</p>
              <p className="purchase_supply-price">preu/u.</p>
              <p className="purchase_supply-units-detail"> unitats</p>
              <p className="purchase_supply-price">subTotal</p>
            </div>
            {purchaseOrderItems &&
              purchaseOrderItems.length > 0 &&
              purchaseOrderItems.map((item, index) => (
                <div key={index} className="purchase_order-item">
                  <p className="purchase_supply-code">{item.code}</p>
                  <p className="purchase_supply-description">{item.name}</p>
                  <p className="purchase_supply-price">
                    {item.price} {providerSelected.currency}/u.
                  </p>
                  <p className="purchase_supply-units-detail">{item.units} u</p>
                  <p className="purchase_supply-price">
                    {item.units * item.price} {providerSelected.currency}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Providers;
