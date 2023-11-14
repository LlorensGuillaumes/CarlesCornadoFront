import React, { useState } from "react";
import "./Processes.css";
import api from "../../Shared/API/api";
import arraySort from "../../Shared/TreatyArray/Treatyarray";
import aceptar from "../../Images/icons/aceptar.png";
import cancelar from "../../Images/icons/cancelar.png";
import papelera from "../../Images/icons/papelera.png";
import agregar from "../../Images/icons/agregar.png";

const Processes = () => {
const [processesData, setProcessesData] = useState([]);
const [isNew, setIsNew] = useState(false);

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

return (
<div className="procesess">
<h1>PROCESSOS</h1>
    <div className="processes-list">
    {processesData &&
        processesData.length > 0 &&
        processesData.map((process, index) => (
        <div key={index} className="procesess-item">
            <p>{process.name}</p>
            <div className="papelera-container">
            <img src={papelera} alt="eliminar" title="Eliminar" className="link"/>
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
    <img src={agregar} alt="agregar" title="Nou Procés"/>
    </div>
    </h2>
    {isNew && (
    <div>
        <input placeholder="Nou procés" />
        <div  className="optionBtn">
        <img src={aceptar} title="Guardar" alt="Guardar" className="link" />
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
