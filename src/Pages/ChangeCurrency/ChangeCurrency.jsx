import React from "react";
import "./ChangeCurrency.css";
import aceptar from "../../Images/icons/aceptar.png";
import cancelar from "../../Images/icons/cancelar.png";

class ChangeCurrency extends React.Component {
constructor(props) {
super(props);
this.state = {
    inputValue: "",
};
}

handleInputChange = (e) => {
this.setState({
    inputValue: e.target.value,
});
};

render() {

return (
    <div className="changeCurrency_popUp">
    <h3>INTRODUEIX CANVI DE MONEDA</h3>
    <h3>1 {this.props.objectToChange.currency} SÓN:</h3>
    <input
        type="text"
        value={this.state.inputValue}
        onChange={this.handleInputChange}
    />{" "}
    €

    <div className="buttons-box">
        <div
        className="optionBtn link"
        onClick={() => {
            this.props.onAceptar({
            value: this.state.inputValue * this.props.objectToChange.value,
            name: this.props.objectToChange.name,
            });
        }}
        >
        <img src={aceptar} title="Aceptar" alt="Aceptar" />
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

export default ChangeCurrency;
