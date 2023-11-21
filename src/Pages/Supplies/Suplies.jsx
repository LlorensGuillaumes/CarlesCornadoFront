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
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [provider, setProvider] = useState("");
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

    const getProviders = () =>{
        api 
            .get('/providers')
            .then((response) => {
                setProvidersData(arraySort.alphabetical(response, "name"));
            })
            .catch((error)=>{
                console.log(error);
            })
    }
    
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
        idProvider: provider,
        price: price
        };

        {
        isNew
            ? api.post("/provisioning/create", newSupplyToSave).then((response) => {
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

    return (
    <div className="procesess">
    <div className="optionBtn" onClick={() => {
        getProviders()
        setIsNew(true)
    }}>
    <img src={agregar} alt="agregar" title="Nou Aprovisonament" className="link" />
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
                <p>{supply.idProvider.name || ""}</p>
                <p>{supply.price} €</p>
    
                <div className="papelera-container">
                {optionsVisible.visible &&
                    optionsVisible.id === supply._id && (
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
                            getProviders()
                            setIsEdit(true)
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
        {isEdit && (
        <div className="new_supply">
        <h1>MODIFICAR</h1>
            <input
            type="text"
            defaultValue={supplySelected.code}
            onChange={(e) => setCode(e.target.value)}
            />
            <input
            type="text"
            defaultValue={supplySelected.description}
            onChange={(e) => setDescription(e.target.value)}
            />
            <input
            type="text"
            defaultValue={supplySelected.price}
            onChange={(e) => setPrice(e.target.value)}
            />
            <div className="optionBtn">
            <select onChange={(e)=>{setProvider(e.target.value)}} defaultValue={supplySelected.idProvider._id}>
            {providersData && providersData.length > 0 && providersData.map((provider, index)=>(
                <option key={index} value={provider._id}>{provider.name}</option>
            ))}
            </select>
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
        )}
        {isNew && (
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
            <select onChange={(e)=>setProvider(e.target.value)}>
            <option>proveidor</option>
            {providersData && providersData.length > 0 && providersData.map((item, index) =>(
                <option key={index} value={item._id}>{item.name}</option>
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
