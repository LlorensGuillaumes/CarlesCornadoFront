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
const [newProcess, setNewProcess] = useState();
const [optionsVisible, setOptionsVisible] = useState(false);
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
        const procesessProviders = response.filter((item)=>(item.family.processes))
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
    name: newProcess.name,
    providers: newProcess.providers._id,
    currency: newProcess.providers.currency,
    price: newProcess.price,
    };
    setProcessesData(null)
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
setOptionsVisible( false );
};
const dropProcess = (confirm) => {
if (confirm) {
    const processToDelete = processSelected._id;
    api.put(`/processes/delete/${processToDelete}`).then((response) => {
    getProcesses();
    });
}
setShowConfirm(false);
setOptionsVisible(false)
};

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
        processesData
        .filter(process => !process.idDeleted)
        .map((process, index) => (
        <div
            key={index}
            className="procesess-item link"
            onClick={() => {
            setProcessSelected(process);
            }}
        >
            <p>{process.name}</p>
            {process.providers && <p>{process.providers.name}</p>}
            {process.price && <p>{process.price}{process.currency}</p>}
            <div className="papelera-container">
            {optionsVisible && processSelected && processSelected._id === process._id && (
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
                    setNewProcess(processSelected)
                    }}
                />
                <img
                    src={cancelar}
                    alt="cacelar"
                    title="Cancelar"
                    className="link optionItem"
                    onClick={() => {
                    setOptionsVisible(false);
                    setIsEdit(false);
                    setIsNew(false);
                    setProcessSelected(null)
                    }}
                />
                </div>
            )}
            </div>
        </div>
        ))}
    </div>

    {(isEdit || isNew) && (
    <div className="processes_modify">
        <input
        type="text"
        placeholder="Nom procès"
        defaultValue={isEdit ? processSelected.name : ""}
        onChange={(e) =>
        setNewProcess((prevProcessSelected) => ({
            ...prevProcessSelected,
            name: e.target.value,
        }))
        }
    />


        <select
        className="process_select-provider"
        defaultValue={
        processSelected
            ? processSelected.providers.name || ""
            : ""
        }
        onChange={(e) => {
        const selectedProvider = providersData.find(
            (item) => item.name === e.target.value
        );
    
        setNewProcess((prevProcessSelected) => ({
            ...prevProcessSelected,
            providers: selectedProvider
            ? {
                _id: selectedProvider._id,
                currency: selectedProvider.currency,
                }
            : { _id: "", name: "", currency: "" },
        }));
        }}
    >
        <option value="">Selecciona proveïdor</option>
        {providersData &&
        providersData.length > 0 &&
        providersData
        .filter(provider => !provider.idDeleted)
        .map((item, index) => (
            <option key={index} value={`${item.name}`}>
            {`${item.name}`}
            </option>
        ))}
    </select>

        <input
        placeholder="Preu"
        defaultValue={isEdit ? processSelected.price : ""}
        onChange={(e) => {
            setNewProcess((prevProcessSelected) => ({
            ...prevProcessSelected,
            price: e.target.value,
            }));
        }}
        />
        <p>{isEdit ? processSelected.providers.currency : ""}</p>
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
