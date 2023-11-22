import React from "react";
import "./DeleteConfirm.css";
import aceptar from "../../Images/icons/aceptar.png";
import cancelar from "../../Images/icons/cancelar.png";

class DeleteConfirm extends React.Component {
render() {
return (
    <div className="deleteConfirm_popUp">
    <h3>ELIMINARÀS</h3>
    <h3>{this.props.text}</h3>

    <div className="buttons-box" >
    <div
        className="optionBtn link"
        onClick={() => {
        this.props.onAceptar(true);
        }}
    >
        <img src={aceptar} title="Acceptar" alt="Acceptar" />
    </div>
    <div
        className="optionBtn link"
        onClick={() => {
        this.props.onCancelar(false);
        }}
    >
        <img src={cancelar} title="Cancelar" alt="Cancelar" />
    </div>
    
    </div>

    </div>
);
}
}

export default DeleteConfirm;
