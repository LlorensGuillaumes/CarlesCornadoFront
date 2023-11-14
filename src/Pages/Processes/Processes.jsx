import React, { useEffect, useState } from "react";
import "./Processes.css";
import api from "../../Shared/API/api";
import arraySort from "../../Shared/TreatyArray/Treatyarray";
import aceptar from "../../Images/icons/aceptar.png";
import cancelar from "../../Images/icons/cancelar.png";
import papelera from "../../Images/icons/papelera.png";
import agregar from "../../Images/icons/agregar.png";
import editar from "../../Images/icons/editar.png";

const Processes = () => {
const [processesData, setProcessesData] = useState([]);
const [isNew, setIsNew] = useState(false);
const [isEdit, setIsEdit] = useState(false);
const [processSelected, setProcessSelected] = useState(null);
const [newProcess, setNewProcess] = useState("");
const [optionsVisible, setOptionsVisible] = useState({
visible: false,
id: "",
});

useEffect(() => {
{
    processSelected
    ? setOptionsVisible({ visible: true, id: processSelected._id })
    : setOptionsVisible({ visible: false, id: "" });
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

useState(() => {
getProcesses();
}, []);

const saveProcess = (isDelete = false) => {
if (isDelete) {
    console.log(processSelected);
    const processToDelete = processSelected._id;
    api.delete(`/processes/delete/${processToDelete}`).then((response) => {
    getProcesses();
    });
} else {
    const newProcessToSave = {
    name: newProcess,
    };

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

return (
<div className="procesess">
    <h1>PROCESSOS</h1>
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

            <div className="papelera-container">
            {optionsVisible.visible &&
                optionsVisible.id === process._id && (
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
    <h2
    className="link"
    onClick={() => {
        setIsNew(true);
    }}
    >
    <div className="optionBtn">
        <img src={agregar} alt="agregar" title="Nou Procés" />
    </div>
    </h2>
    {isEdit && (
    <div>
        <input
        type="text"
        defaultValue={processSelected.name}
        onChange={(e) => setNewProcess(e.target.value)}
        />
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
    )}
    {isNew && (
    <div>
        <input
        placeholder="Nou procés"
        onChange={(e) => setNewProcess(e.target.value)}
        />
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
    )}
</div>
);
};

export default Processes;
