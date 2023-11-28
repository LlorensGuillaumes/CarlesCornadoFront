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
const [providers, setProviders] = useState([
{ idProvider: null, price: null },
]);
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
    setProvidersData(arraySort.alphabetical(response, "name"));
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
setOptionsVisible({ visible: false, id: "" });
};

console.log(providersData);
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
        suppliesData.map((supply, index) => (
        <div
            key={index}
            className="procesess-item link"
            onClick={() => {
            setSupplySelected(supply);
            }}
        >
            <p>{supply.description}</p>
            <p>{supply.code}</p>
            {supply.providers &&
            supply.providers.length > 0 &&
            supply.providers.map((provider, index) => (
                <div key={index}>
                <p>{provider.name}</p>
                <p>{provider.price}</p>
                </div>
            ))}
            <div className="papelera-container">
            {optionsVisible.visible && optionsVisible.id === supply._id && (
                <div className="processes-options">
                <img
                    src={papelera}
                    alt="eliminar"
                    title="Eliminar"
                    className="link optionItem"
                    onClick={() => {
                    saveSupplies(true);
                    }}
                />
                <img
                    src={editar}
                    alt="editar"
                    title="Editar"
                    className="link optionItem"
                    onClick={() => {
                    getProviders();
                    setIsEdit(true);
                    }}
                />
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
            )}
            </div>
        </div>
        ))}
    </div>
    {(isEdit || isNew) && (
    <div className="new_supply">
        <h1>{isEdit ? "MODIFICAR" : "NOU APROVISIONAMENT"}</h1>
        <input
        type="text"
        placeholder="Codi"
        defaultValue={supplySelected ? supplySelected.code : ""}
        onChange={(e) => setCode(e.target.value)}
        />
        <input
        type="text"
        placeholder="Aprovisionament"
        defaultValue={supplySelected ? supplySelected.description : ""}
        onChange={(e) => setDescription(e.target.value)}
        />
        <div className="providers_list">
        <div className="providers_list-left">
        {providersData &&
        providersData.length > 0 &&
        providersData.map((provider, index) => (
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
                <div className="optionBtnList">
                <img 
                className="link btnAgregar"
                src={agregar} 
                alt="Afegir" 
                title="Afegir"/>
                </div>
            </div>
            
        ))}
        </div>
        <div className="providers_list-right"></div>

        
        </div>

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
                }}
            />
            </div>
        </div>
    </div>
    )}
    {isEdit && (
    <div className="new_supply">
        <h1>NOU APROVISIONAMENT</h1>
        <input
        className="text_input"
        placeholder="Codi"
        onChange={(e) => setCode(e.target.value)}
        />
        <input
        className="text_input"
        placeholder="Nom"
        onChange={(e) => setDescription(e.target.value)}
        />
        <input
        className="text_input"
        placeholder="Preu"
        onChange={(e) => setPrice(e.target.value)}
        />
        <select onChange={(e) => setProviders(e.target.value)}>
        <option>proveidor</option>
        {providersData &&
            providersData.length > 0 &&
            providersData.map((item, index) => (
            <option key={index} value={item._id}>
                {item.name}
            </option>
            ))}
        </select>

        <div className="optionBtn">
        <img
            src={aceptar}
            title="Guardar"
            alt="Guardar"
            className="link"
            onClick={() => {
            setIsNew(false);
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
            setIsNew(false);
            }}
        />
        </div>
    </div>
    )}
</div>
);
};
export default Suplies;
