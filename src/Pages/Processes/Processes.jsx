import React, { useEffect, useState } from "react";
import "./Processes.css";
import api from "../../Shared/API/api";
import arraySort from "../../Shared/TreatyArray/Treatyarray";
import aceptar from "../../Images/icons/aceptar.png";
import cancelar from "../../Images/icons/cancelar.png";
import papelera from "../../Images/icons/papelera.png";
import agregar from "../../Images/icons/agregar.png";
import editar from "../../Images/icons/editar.png";
import DeleteConfirm from "../DeleteConfirm/DeleteConfirm";
import TreatyArray from "../../Shared/TreatyArray/Treatyarray";

const Processes = () => {
const [processesData, setProcessesData] = useState([]);
const [providersData, setProvidersData] = useState([]);
const [isNew, setIsNew] = useState(false);
const [isEdit, setIsEdit] = useState(false);
const [processSelected, setProcessSelected] = useState(null);
const [newProcessName, setNewProcessName] = useState("");
const [newProcessProvider, setNewProcessProvider] = useState("");
const [price, setPrice] = useState("");
const [priceVisible, setPriceVisible] = useState(0);
const [optionsVisible, setOptionsVisible] = useState({
visible: false,
id: "",
});
const [showConfirm, setShowConfirm] = useState(false);

useEffect(() => {
{
    processSelected ? setOptionsVisible(true) : setOptionsVisible(false);
}
}, [processSelected]);

const getProcesses = () => {
api
    .get("/processes")
    .then((response) => {
    setProcessesData(arraySort.alphabetical(response, "name"));
    })
    .catch((error) => {
    console.log(error);
    });
};
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
getProcesses();
getProviders();
}, []);

const saveProcess = (isDelete = false) => {
if (isDelete) {
    setShowConfirm(true);
} else {
    const newProcessToSave = {
    name: processSelected.name,
    providers: processSelected.providers,
    price: processSelected.price,
    };

    console.log(newProcessToSave);
    {
    isNew
        ? api.post("/processes/create", newProcessToSave).then((response) => {
            setIsNew(false);
            getProcesses();
        })
        : api
            .put(`/processes/edit/${processSelected._id}`, newProcessToSave)
            .then((response) => {
            setIsEdit(false);
            getProcesses();
            });
    }
}
setOptionsVisible({ visible: false, id: "" });
};
const dropProcess = (confirm) => {
if (confirm) {
    const processToDelete = processSelected._id;
    api.put(`/processes/delete/${processToDelete}`).then((response) => {
    getProcesses();
    });
}
setShowConfirm(false);
};
console.log(processSelected);
console.log(optionsVisible);

return (
<div className="procesess">
    <div
    className="optionBtn link"
    onClick={() => {
        setIsNew(true);
        setIsEdit(false);
    }}
    >
    <img src={agregar} alt="agregar" title="Nou Procés" />
    </div>
    <div className="processes-list">
    {processesData &&
        processesData.length > 0 &&
        processesData.map((process, index) => (
        <div
            key={index}
            className="procesess-item link"
            onClick={() => {
            setProcessSelected(process);
            }}
        >
            <p>{process.name}</p>
            {process.providers && <p>{process.providers.name}</p>}
            {process.price && <p>{process.price}</p>}
            <div className="papelera-container">
            {processSelected && processSelected._id === process._id && (
                <div className="processes-options">
                <img
                    src={papelera}
                    alt="eliminar"
                    title="Eliminar"
                    className="link optionItem"
                    onClick={() => {
                    saveProcess(true);
                    }}
                />
                <img
                    src={editar}
                    alt="editar"
                    title="Editar"
                    className="link optionItem"
                    onClick={() => {
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

    {isEdit && (
    <div className="processes_modify">
        <input
        type="text"
        defaultValue={processSelected.name}
        onChange={(e) => 
            setProcessSelected((prevProcessSelected) => ({
                ...prevProcessSelected,
                name: e.target.value,
                }))
        }
        />
        <select
        className="process_select-provider"
        value={
            processSelected.providers
            ? processSelected.providers.name || ""
            : ""
        }
        onChange={(e) => {
            setProcessSelected((prevProcessSelected) => ({
            ...prevProcessSelected,
            providers: { name: e.target.value },
            }))
            e.target.value !== "Safident" ? setPriceVisible(true) : setPriceVisible(false);
        }}
        >
        <option value="">Selecciona proveïdor</option>
        {providersData &&
            providersData.length > 0 &&
            providersData.map((item, index) => (
            <option key={index} value={item.name}>
                {item.name}
            </option>
            ))}
        </select>
        {priceVisible && processSelected.providers !== "Safident" &&
            <input 
                placeholder="Preu" 
                onChange={(e) => {
                    setProcessSelected((prevProcessSelected) => ({
                        ...prevProcessSelected,
                        price: e.target.value,
                    }));
                }}
            />
        }
        <div className="buttons-box" id="processesBtnBox">
        <div className="optionBtn">
            <img
            src={aceptar}
            title="Guardar"
            alt="Guardar"
            className="link"
            onClick={() => {
                saveProcess();
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
    {isNew && (
    <div className="processes_modify">
        <input
        placeholder="Nou procés"
        onChange={(e) => setNewProcessName(e.target.value)}
        />
        <select
        className="process_select-provider"
        onChange={(e) => {
            setNewProcessProvider(e.target.value);
            e.target.value !== "Safident" && setPriceVisible(true);
        }}
        >
        <option>Selecciona proveïdor</option>
        {providersData &&
            providersData.length > 0 &&
            providersData.map((item, index) => (
            <option key={index}>{item.name}</option>
            ))}
        </select>
        <div className="buttons-box" id="processesBtnBox">
        <div className="optionBtn">
            <img
            src={aceptar}
            title="Guardar"
            alt="Guardar"
            className="link"
            onClick={() => {
                setIsNew(false);
                saveProcess();
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
    </div>
    )}
    {showConfirm && (
    <DeleteConfirm
        text={processSelected.name}
        onAceptar={() => dropProcess(true)}
        onCancelar={() => dropProcess(false)}
    />
    )}
</div>
);
};

export default Processes;
