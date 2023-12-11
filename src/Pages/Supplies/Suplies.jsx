import React, { useEffect, useState } from "react";
import "./Suplies.css";
import api from "../../Shared/API/api";
import arraySort from "../../Shared/TreatyArray/Treatyarray";
import aceptar from "../../Images/icons/aceptar.png";
import cancelar from "../../Images/icons/cancelar.png";
import papelera from "../../Images/icons/papelera.png";
import agregar from "../../Images/icons/agregar.png";
import editar from "../../Images/icons/editar.png";

const Suplies = () => {
const [suppliesData, setSuppliesData] = useState([]);
const [providersData, setProvidersData] = useState([]);
const [isNew, setIsNew] = useState(false);
const [isEdit, setIsEdit] = useState(false);
const [supplySelected, setSupplySelected] = useState(null);
const [code, setCode] = useState("");
const [description, setDescription] = useState("");
const [price, setPrice] = useState({index: null, price: null});
const [providers, setProviders] = useState([]);
const [optionsVisible, setOptionsVisible] = useState({
visible: false,
id: "",
});

useEffect(() => {
{
    supplySelected
    ? setOptionsVisible({ visible: true, id: supplySelected._id })
    : setOptionsVisible({ visible: false, id: "" });
}
}, [supplySelected]);

const getSupplies = () => {
api
    .get("/provisioning")
    .then((response) => {
    setSuppliesData(arraySort.alphabetical(response, "description"));
    })
    .catch((error) => {
    console.log(error);
    });
};

const getProviders = () => {
api
    .get("/providers")
    .then((response) => {
        const suppliesProviders = response.filter((item)=>(item.family.provisioning))
    setProvidersData(arraySort.alphabetical(suppliesProviders, "name"));
    })
    .catch((error) => {
    console.log(error);
    });
};

useEffect(() => {
getSupplies();
}, []);

const saveSupplies = (isDelete = false) => {
if (isDelete) {
    const suplyToDelete = supplySelected._id;
    api.delete(`/provisioning/delete/${suplyToDelete}`).then((response) => {
    getSupplies();
    });
} else {
    const newSupplyToSave = {
    code: code,
    description: description,
    providers: providers,
    };

    {
    isNew
        ? api
            .post("/provisioning/create", newSupplyToSave)
            .then((response) => {
            setIsNew(false);
            getSupplies();
            })
        : api
            .put(`/provisioning/edit/${supplySelected._id}`, newSupplyToSave)
            .then((response) => {
            setIsEdit(false);
            getSupplies();
            });
    }
}
setOptionsVisible({ visible: false, id: "" })
setIsNew(false);
setIsEdit(false)
setProviders(false)
setPrice({index: null, price: null})
};
const fnSelectSupply = (supply) => {
    setSupplySelected(supply);
    setProviders(supply.Providers)
}
return (
<div className="procesess">
    <div
    className="optionBtn"
    onClick={() => {
        getProviders();
        setIsNew(true);
    }}
    >
    <img
        src={agregar}
        alt="agregar"
        title="Nou Aprovisonament"
        className="link"
    />
    </div>
    <div className="processes-list">
    {suppliesData &&
        suppliesData.length > 0 &&
        suppliesData
        .filter(supply => !supply.idDeleted)
        .map((supply, index) => (
        <div
            key={index}
            className="supplies_item link"
            onClick={() => {
            fnSelectSupply(supply);
            }}
        >
            <h3 className="supplies_code">{supply.description}</h3>
            <h3 className="supplies_code">{supply.code}</h3>
            <h4 className="supplies_providers">Proveïdors</h4>
            {supply.providers &&
            supply.providers.length > 0 &&
            supply.providers.map((provider, index) => (
                <div key={index} className="supplies_providers">
                <p>{provider.idProvider.name}: {provider.price} {provider.currency}</p>
                </div>
            ))}
            {optionsVisible.visible && optionsVisible.id === supply._id && (
                <div className="buttons-box buttons-box-supplies-container">
                <div className="buttons-box-supplies">
                <img
                    src={papelera}
                    alt="eliminar"
                    title="Eliminar"
                    className="link optionItem"
                    onClick={() => {
                    saveSupplies(true);
                    }}
                />
                </div>
                <div className="buttons-box-supplies">
                <img
                    src={editar}
                    alt="editar"
                    title="Editar"
                    className="link optionItem"
                    onClick={() => {
                    getProviders();
                    setIsEdit(true);
                    setIsNew(false)
                    }}
                />
                </div>
                <div className="buttons-box-supplies">
                <img
                    src={cancelar}
                    alt="cacelar"
                    title="Cancelar"
                    className="link optionItem"
                    onClick={() => {
                    setOptionsVisible({ visible: false, id: "" });
                    }}
                />
                </div>
                
                </div>
            )}
        </div>
        ))}
    </div>
    {(isEdit || isNew) && (
    <div className="new_supply">
        <h1>{isEdit ? "MODIFICAR" : "NOU APROVISIONAMENT"}</h1>
        <div className="buttons-box">
            <div className="optionBtn">
            <img
                src={aceptar}
                title="Guardar"
                alt="Guardar"
                className="link"
                onClick={() => {
                saveSupplies();
                }}
            />
            </div>
            <div className="optionBtn">
            <img
                src={cancelar}
                title="Cancelar"
                alt="Cancelar"
                className="link"
                onClick={() => {
                setIsEdit(false);
                setIsNew(false);
                }}
            />
            </div>
        </div>
        <div className="onLineText">
        <input
        type="text"
        placeholder="Codi"
        defaultValue={supplySelected ? supplySelected.code : ""}
        onChange={(e) => setCode(e.target.value)}
        className="suply_code"
        />
        <input
        type="text"
        placeholder="Aprovisionament"
        defaultValue={supplySelected ? supplySelected.description : ""}
        onChange={(e) => setDescription(e.target.value)}
        className="suply_text"
        />        
        </div>
        
        <div className="providers_list">
        <div className="providers_list-left">
        {providersData &&
        providersData.length > 0 &&
        providersData
        .filter(provider => !provider.idDeleted && provider.family.provisioning)
        .map((provider, index) => (
            <div key={index} className="providers_items">
            <p 
                value={provider._id}
                className="new_supply-name"
                >{provider.name}</p>
            <input 
                type="text" 
                placeholder="Preu" 
                className="new_supply-price"
                onChange={(e)=>{setPrice({index: index, price:e.target.value})}}
                />
                <p>{provider.currency}</p>
                {price && price.index === index && 
            <div className="optionBtnList">
                <img 
                className="link btnAgregar"
                src={agregar} 
                alt="Afegir" 
                title="Afegir"
                onClick={()=>{
                    setProviders((prevProviders) => [
                        ...prevProviders,
                        { idProvider: provider._id, providerName: provider.name, price: price.price, currency: provider.currency },
                        ]);
                }}
                    />
                </div>
                
                }
            </div>
            
        ))}
        </div>
        <div className="providers_list-right">
        <h3 className="suply_select-providers">PROVEÏDORS SELECCIONATS</h3>
        {providers && providers.length > 0 && providers.map((provider, index)=>(
            <div key={index} className="providers_list-item">
            <p className="providers_list-name">{provider.providerName}</p>
            <p>{provider.price} {provider.currency}</p>
            <div className="optionBtnList">
                <img 
                className="link btnAgregar"
                src={papelera} 
                alt="Afegir" 
                title="Afegir"
                onClick={() => setProviders(prevProviders => prevProviders.filter(item => item.idProvider !== provider.idProvider))}
                    />
                </div>
            </div>
        ))}
        </div>

        
        </div>

        
    </div>
    )}
</div>
);
};
export default Suplies;
