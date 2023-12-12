import React, { useEffect, useState } from "react";
import "./Customers.css";
import api from "../../Shared/API/api";
import agregar from "../../Images/icons/agregar.png";
import aceptar from "../../Images/icons/aceptar.png";
import cancelar from "../../Images/icons/cancelar.png";
import editar from "../../Images/icons/editar.png";
import order from "../../Images/icons/order.png";

const Customers = () => {
const [customersData, setCustomersData] = useState([]);
const [customerSelected, setCustomerSelected] = useState(null);
const [isNew, setisNew] = useState(false);
const [isEdit, setIsEdit] = useState(false);
const [detail, setDetail] = useState(false);
const [createOrder, setCreateOrder] = useState(false);

const [customerName, setCustomerName] = useState();
const [customerIdentificationNumber, setCustomerIdentificationNumber] =
useState();
const [customerCountry, setCustomerCountry] = useState();
const [customerCity, setCustomerCity] = useState();
const [customerCityCode, setCustomerCityCode] = useState();
const [customerAddress, setCustomerAddress] = useState();
const [customerPhone, setCustomerPhone] = useState();
const [customerEmail, setcustomerEmail] = useState();
const [customerDicount, setcustomerDicount] = useState();
const [customerShipmentFree, setCustomerShipmentFree] = useState(false);
const [customerObservations, setCustomerObservations] = useState();

useEffect(() => {
getCustomers();
}, []);

const getCustomers = () => {
api.get("/customers").then((response) => {
    console.log(response);
    setCustomersData(response);
});
};

const saveCustomer = () => {
const newCustomer = {
    name: customerName,
    taxIdentificationNumber: customerIdentificationNumber,
    country: customerCountry,
    city: customerCity,
    cityCode: customerCityCode,
    address: customerAddress,
    phone: customerPhone,
    email: customerEmail,
    discount: customerDicount,
    shipmentFree: customerShipmentFree,
    observations: customerObservations,
};

if (isNew) {
    api.post("/customers/create", newCustomer).then(() => {
    getCustomers();
    });
}

if (isEdit) {
    api
    .put(`/customers/edit/${customerSelected._id}`, newCustomer)
    .then(() => {
        getCustomers();
    });
}

setisNew(false);
setIsEdit(false);
setDetail(false);
setCustomerSelected(null);
};

const selectCustomer = (customer) => {
setCustomerSelected(customer);
setDetail(true);
};

useEffect(() => {
if (customerSelected) {
    setCustomerName(customerSelected.name);
    setCustomerIdentificationNumber(customerSelected.taxIdentificationNumber);
    setCustomerCountry(customerSelected.country);
    setCustomerCity(customerSelected.city);
    setCustomerCityCode(customerSelected.cityCode);
    setCustomerAddress(customerSelected.address);
    setCustomerPhone(customerSelected.phone);
    setcustomerEmail(customerSelected.email);
    setcustomerDicount(customerSelected.discount);
    setCustomerShipmentFree(customerSelected.shipmentFree);
    setCustomerObservations(customerSelected.observations);
}
}, [customerSelected]);

return (
<div className="customers_container">
    <div className="buttons-box">
    <div>
        <img
        src={agregar}
        alt="Nou client"
        title="Nou client"
        className="link"
        onClick={() => {
            setisNew(true);
        }}
        />
    </div>
    </div>

    {customersData &&
    customersData.length > 0 &&
    customersData.map((customer, index) => (
        <div
        key={index}
        className="link customer_item"
        onClick={() => {
            selectCustomer(customer);
        }}
        >
        <p>{customer.name}</p>
        <p>{customer.phone}</p>
        <p className="customer_email">{customer.email}</p>
        </div>
    ))}

    {(isNew || isEdit || detail) && (
    <div className="customer_edit_new">
        {isNew ? (
        <h3>Nou client</h3>
        ) : isEdit ? (
        <h3>Modificar Client</h3>
        ) : null}
        <div className="buttons-box">
        {(isEdit || isNew) && (
            <div>
            <img
                src={aceptar}
                className="link"
                alt="aceptar"
                title="aceptar"
                onClick={() => {
                saveCustomer();
                }}
            />
            </div>
        )}

        <div>
            <img
            src={cancelar}
            className="link"
            alt="cancelar"
            title="cancelar"
            onClick={() => {
                setDetail(false);
                setIsEdit(false);
                setisNew(false);
            }}
            />
        </div>

        {detail && (
            <>
            <div>
                <img
                src={editar}
                className="link"
                alt="editar"
                title="editar"
                onClick={() => {
                    setIsEdit(true);
                    setDetail(false);
                }}
                />
            </div>
            <div>
                <img
                src={order}
                className="link"
                alt="order"
                title="order"
                onClick={() => {
                    setIsEdit(false);
                    setisNew(false);
                    setCreateOrder(true);
                }}
                />
            </div>
            </>
        )}
        </div>

        <div className="customer_name_identification-number">
        {detail ? (
            <p>{customerName}</p>
        ) : (
            <input
            placeholder="Nom"
            defaultValue={isEdit ? customerName : ""}
            onChange={(e) => {
                setCustomerName(e.target.value);
            }}
            />
        )}
        -
        {detail ? (
            <p>{customerIdentificationNumber}</p>
        ) : (
            <input
            placeholder="CIF"
            defaultValue={isEdit ? customerIdentificationNumber : ""}
            onChange={(e) => {
                setCustomerIdentificationNumber(e.target.value);
            }}
            />
        )}
        </div>

        {detail ? (
        <p>{customerPhone}</p>
        ) : (
        <input
            placeholder="Teléfon"
            defaultValue={isEdit ? customerPhone : ""}
            onChange={(e) => {
            setCustomerPhone(e.target.value);
            }}
        />
        )}

        {detail ? (
        <p>{customerEmail}</p>
        ) : (
        <input
            placeholder="email"
            defaultValue={isEdit ? customerEmail : ""}
            onChange={(e) => {
            setcustomerEmail(e.target.value);
            }}
        />
        )}

        {detail ? (
        <p>{customerAddress}</p>
        ) : (
        <input
            placeholder="Adreça"
            defaultValue={isEdit ? customerAddress : ""}
            onChange={(e) => {
            setCustomerAddress(e.target.value);
            }}
        />
        )}

        <div className="customer_name_identification-number">
        {detail ? (
            <p>{customerCityCode}</p>
        ) : (
            <input
            placeholder="CP"
            defaultValue={isEdit ? customerCityCode : ""}
            onChange={(e) => {
                setCustomerCityCode(e.target.value);
            }}
            />
        )}
        -
        {detail ? (
            <p>{customerCity}</p>
        ) : (
            <input
            placeholder="Població"
            defaultValue={isEdit ? customerCity : ""}
            onChange={(e) => {
                setCustomerCity(e.target.value);
            }}
            />
        )}
        </div>

        {detail ? (
        <p>{customerCountry}</p>
        ) : (
        <input
            placeholder="Pais"
            defaultValue={isEdit ? customerCountry : ""}
            onChange={(e) => {
            setCustomerCountry(e.target.value);
            }}
        />
        )}

        {detail ? (
        <p>Descompte: {customerDicount} %</p>
        ) : (
        <input
            placeholder="Descompte"
            defaultValue={isEdit ? customerDicount : ""}
            onChange={(e) => {
            setcustomerDicount(e.target.value);
            }}
        />
        )}

        {detail ? (
        customerShipmentFree ? (
            <p>Enviament Gratuït</p>
        ) : (
            <p>Paga enviament</p>
        )
        ) : (
        <label>
            Enviament Gratuït
            <input
            type="checkbox"
            defaultChecked={isEdit ? customerShipmentFree : false}
            onChange={(e) => {
                setCustomerShipmentFree(e.target.checked);
            }}
            />
        </label>
        )}

        {detail ? (
        <p>{customerObservations}</p>
        ) : (
        <input
            placeholder="Observacions"
            defaultValue={isEdit ? customerObservations : ""}
            onChange={(e) => {
            setCustomerObservations(e.target.value);
            }}
        />
        )}
    </div>
    )}

    {createOrder && (
    <div className="customer_order">
        <div className="buttons-box">
        <div>
            <img
            src={aceptar}
            className="link"
            alt="aceptar"
            title="aceptar"
            onClick={() => {
                saveCustomer();
            }}
            />
        </div>

        <div>
            <img
            src={cancelar}
            className="link"
            alt="cancelar"
            title="cancelar"
            onClick={() => {
                setDetail(false);
                setIsEdit(false);
                setisNew(false);
            }}
            />
        </div>
        </div>
        <div></div>
    </div>
    )}
</div>
);
};

export default Customers;
