import React, { useEffect, useState } from "react";
import "./PurchaseOrder.css";
import html2pdf from "html2pdf.js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import api from "../../Shared/API/api";
import TreatyArray from "../../Shared/TreatyArray/Treatyarray";
import detalle from "../../Images/icons/detalle.png";
import logo from "../../Images/logo.jpg"
const PurchaseOrder = () => {
const [purchaseOrderData, setPurchaseOrderData] = useState([]);
const [purchaseOrderSelected, setPurchaseOrderSelected] = useState({});
const [purchaseList, setPurchaseList] = useState({
idOrder: null,
orderNumber: null,
date: null,
provider: null,
total: 0,
});

useEffect(() => {
getPurchaseOrders();
}, []);

useEffect(() => {
const updatedPurchaseList = purchaseOrderData.map((order) => {
    const day = order.orderNumber.slice(4, 6);
    const month = order.orderNumber.slice(2, 4);
    const year = order.orderNumber.slice(0, 2);

    const total = order.provisioning.reduce((sum, item) => {
    const subtotal = item.price * item.units;
    return sum + subtotal;
    }, 0);
    console.log(order);
    return {
    idOrder: order._id,
    orderNumber: order.orderNumber,
    date: `${day}/${month}/${year}`,
    provider: order.idProvider,
    total: total,
    provisioning: order.provisioning,
    };
});

setPurchaseList(updatedPurchaseList);
}, [purchaseOrderData]);

const getPurchaseOrders = () => {
api.get("/purchases").then((response) => {
    console.log(response);
    const sortedData = TreatyArray.alphabetical(response, "orderNumber");
    const reverseData = sortedData.reverse();
    setPurchaseOrderData(reverseData);
});
};

const generatePDF = async () => {
try {
    const content = document.getElementById("mypdf");
    const pdfDataUri = await html2pdf(content, {
    margin: 10,
    filename: purchaseOrderSelected.orderNumber,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 1 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    });
} catch (error) {
    console.error("Error al generar el PDF:", error);
}
};


  
console.log(purchaseOrderSelected);
return (
<div>
    <h1>ORDRES DE COMPRA</h1>
    <div className="purchases_list">
    <p className="purchase_number">codi</p>
    <p className="purchase_date">data</p>
    <p className="purchase_provider">Proveïdor</p>
    <p className="purchase_total">Import</p>
    </div>
    {purchaseList &&
    purchaseList.length > 0 &&
    purchaseList.map((item, index) => (
        <div key={index} className="purchases_list-item">
        <p className="purchase_number">{item.orderNumber}</p>
        <p className="purchase_date">{item.date}</p>
        <p className="purchase_provider">{item.provider.name || ""}</p>
        <p className="purchase_total">{item.total}€</p>
        <div
            className="optionBtn link"
            onClick={() => {
            setPurchaseOrderSelected(item);
            }}
        >
            <img src={detalle} alt="Detalle" title="Detalle" />
        </div>
        </div>
    ))}

    {purchaseOrderSelected && purchaseOrderSelected.provider && (
    <div className="order_detail">
    <div>
    <button onClick={()=>{generatePDF()}}>PDF</button>
    </div>
    <div id="mypdf">
        <div className="purhcase-order_header">
        <div className="purchase-order_logo">
        <img src={logo} alt="logo"/>
        </div>
        <div className="purchase-order_text">
            <p>Instruments and products for dental laboratory</p>
            <p>Instumentos y productos para laboratorios dentales</p>
            <p>Instruments et produits pour les laboratoires dentaires</p>
            <p>Instruments i productes per a laboratoris dentals</p>
        </div>
    
    </div>
        <div className="purchase_header">
            <div className="purchase-order_company">
            <p>Safident</p>
            <p>Carrer Ponent, 10</p>
            <p>43700 El Vendrell</p>
            <p>Tarragona - Spain</p>
            <p>CIF - B55576672</p>
            </div>
            <div className="purchase-order_provider">
            <p>{purchaseOrderSelected.provider.name}</p>
            <p>{purchaseOrderSelected.provider.address}</p>
            <div className="purchase-order_city">
            <p>{purchaseOrderSelected.provider.cityCode}</p>
            <p>{purchaseOrderSelected.provider.city}</p>
            </div>
            <p>{purchaseOrderSelected.provider.country}</p>
            </div>
        </div>

        <div className="order_data">
            <h3>Comanda nº{purchaseOrderSelected.orderNumber}</h3>
            <h3>Data:{purchaseOrderSelected.date}</h3>
        </div>

        <div className="order_list header-list">
        <p className="purchase-order_units">Quantitat</p>
        <p className="purchase-order_code">Codi</p>
        <p className="purchase-order_name">Descripció</p>
        <p className="purchase-order_price">Preu UD.</p>
        <p className="purchase-order_price">Import</p>
        
        </div>

        {purchaseOrderSelected.provisioning &&
            purchaseOrderSelected.provisioning.map((item, index) => (
            <div key={index} className="order_list">
                <p className="purchase-order_units">{item.units}x</p>
                <p className="purchase-order_code">{item.idSuply.code}</p>
                <p className="purchase-order_name">{item.idSuply.description}</p>
                <p className="purchase-order_price">{item.price}€</p>
                <p className="purchase-order_price">{item.units * item.price}€</p>
            </div>
            ))}
            <h3 className="purchase-order_total">TOTAL: {purchaseOrderSelected.total}€</h3>
            <p className="purchase-order_nota">NOTA: La seva homologació com a proveïdor serà avaluada de forma continua considerant la satisfacció del clent final.</p>
        </div>
    
    
    
    </div>


    )}
</div>
);
};

export default PurchaseOrder;
