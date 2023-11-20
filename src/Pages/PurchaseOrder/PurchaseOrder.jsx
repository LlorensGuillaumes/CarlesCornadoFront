import React, { useEffect, useState } from 'react'
import './PurchaseOrder.css'
import api from '../../Shared/API/api';
import TreatyArray from '../../Shared/TreatyArray/Treatyarray';
import detalle from '../../Images/icons/detalle.png';
const PurchaseOrder = () => {
    const [purchaseOrderData, setPurchaseOrderData] = useState([]);
    const [purchaseOrderSelected, setPurchaseOrderSelected] = useState({});
    const [purchaseList, setPurchaseList] = useState({idOrder: null, orderNumber: null, date: null, provider: null, total:0})

useEffect(()=>{ 
    getPurchaseOrders();

},[]);

useEffect(() => {
const updatedPurchaseList = purchaseOrderData.map((order) => {
    const day = order.orderNumber.slice(4, 6);
    const month = order.orderNumber.slice(2, 4);
    const year = order.orderNumber.slice(0, 2);

    const total = order.provisioning.reduce((sum, item) => {
    const subtotal = item.price * item.units;
    return sum + subtotal;
    }, 0);
console.log(order)
    return {
    idOrder: order._id,
    orderNumber: order.orderNumber,
    date: `${day}/${month}/${year}`,
    provider: order.idProvider,
    total: total,
    };
});

setPurchaseList(updatedPurchaseList);
}, [purchaseOrderData]);


const getPurchaseOrders = () => {
    api.get('/purchases')
    .then((response)=>{
        console.log(response)
        const sortedData = (TreatyArray.alphabetical(response, 'orderNumber'))
        const reverseData = sortedData.reverse();
        setPurchaseOrderData(reverseData);

    })
}
console.log(purchaseOrderSelected)
return (
    <div>
    <h1>ORDRES DE COMPRA</h1>
    <div className='purchases_list'>
    <p className='purchase_number'>codi</p>
    <p className='purchase_date'>data</p>
    <p className='purchase_provider'>Proveïdor</p>
    <p className='purchase_total'>Import</p>
    </div>
    {purchaseList && purchaseList.length > 0 && purchaseList.map((item, index)=>(
        <div key={index} className='purchases_list-item'>
        <p className='purchase_number'>{item.orderNumber}</p>
        <p className='purchase_date'>{item.date}</p>
        <p className='purchase_provider'>{item.provider.name || ''}</p>
        <p className='purchase_total'>{item.total}€</p>
        <div 
        className='optionBtn link'
        onClick={()=>{setPurchaseOrderSelected(item)}}
        >
        <img 
        src={detalle} 
        alt='Detalle' 
        title='Detalle'/>
        </div>
        </div>
    ))}

    {purchaseOrderSelected && purchaseOrderSelected.provider && 
    <div>
    <div className='order_detail'>
    <p>{purchaseOrderSelected.date}</p>
    <p>{purchaseOrderSelected.orderNumber}</p>
    <p>{purchaseOrderSelected.provider.name || ''}</p>
    </div>
    
    
    </div>
    }
    
    </div>
)
}

export default PurchaseOrder