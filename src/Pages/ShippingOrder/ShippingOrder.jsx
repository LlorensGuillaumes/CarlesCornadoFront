import React, { useEffect, useState } from 'react'
import './ShippingOrder.css';
import api from '../../Shared/API/api';
import cancelar from "../../Images/icons/cancelar.png";
import editar from "../../Images/icons/editar.png";

const ShippingOrder = () => {
    const [shippingOrderData, setShippingOrderData] = useState([]);
    const [shippingOrder, setShippingOrder] = useState([]);
    const [productsData, setProductsData] = useState([]);
    const [componentsData, setComponentsData] = useState([]);
    const [shippingOrderSelected, setShippingOrderSelected] = useState(null);
    const [selectedOption, setSelectedOption] = useState('generat');
    const [shippingOrderStateVisble, setShippingOrderStateVisible] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    
    useEffect(()=>{
        getShippingOrders();
        getComponents();
        getProducts();
    },[])

    const getShippingOrders = () =>{
        api.get('/shippingOrder')
            .then((response)=>{
                setShippingOrderData(response.filter((item)=>!item.isDeleted))
            })
    }
    const getProducts = () => {
        api.get('/products')
        .then((response)=>{
            setProductsData(response)
        })
    }

    const getComponents = () => {
        api.get('/components')
        .then((response)=>{
            setComponentsData(response)
        })
    }
    const getShippingOrdersById = () => {
        api.get(`/shippingOrder/id/${shippingOrderSelected._id}`)
        .then((response) => {
            setShippingOrderSelected(response)
        })
    }

    useEffect(() => {
        if (shippingOrderSelected) {
      
          for (const item of shippingOrderSelected.detail) {      
            const objComponent = componentsData.find((component) => component._id === item.id);      
            if (!objComponent) {
              const objProduct = productsData.find((product) => product._id === item.id);
      
              if (objProduct) {
                objProduct.units = item.units;
                if (!shippingOrder.find((existingItem) => existingItem._id === objProduct._id)) {
                  setShippingOrder((prevShippingOrder) => [...prevShippingOrder, objProduct]);
                }
              }
            } else {
              objComponent.units = item.units;
              if (!shippingOrder.find((existingItem) => existingItem._id === objComponent._id)) {
                setShippingOrder((prevShippingOrder) => [...prevShippingOrder, objComponent]);
              }
            }
          }
        }
      }, [shippingOrderSelected, productsData, componentsData, shippingOrder]);
      
      const fnUpdateState = (value) =>{
        console.log(value)
        console.log(shippingOrderSelected._id)
        api.put(`/shippingOrder/edit/${shippingOrderSelected._id}`,{state:value})
        .then((response)=>console.log(response))
        .then(()=>{getShippingOrdersById()})
      };

  return (
    <div className='shippingOrder-container'>
    {shippingOrderData && shippingOrderData.length > 0 && shippingOrderData.map((shippingOrderItem, index) => (
      <div 
      key={index} 
      className='shippingOrder-items'
      onClick={()=>{
        setShippingOrderSelected(shippingOrderItem)
        setIsEdit(false)        
        setShippingOrder([])
    }}
      >
        <p>{shippingOrderItem.date}</p>
        <p>{shippingOrderItem.orderNumber}</p>
        <p>{shippingOrderItem.customer.name}</p>
        <p>{shippingOrderItem.observations}</p>
       
      </div>
    ))}

    {shippingOrderSelected && (
        <div className='shippingOrder_detail_item'>
            <div className='optionBtn'>
                <div>
                    <img 
                    className='link'
                    src={cancelar} 
                    alt='Cancelar' 
                    title='Cancelar'
                    onClick={()=>{setShippingOrderSelected(null)}}/>
                </div>
            </div>
            <h3>{shippingOrderSelected.customer.name} </h3>
            <h4>{shippingOrderSelected.date} - {shippingOrderSelected.orderNumber} - {shippingOrderSelected.state}</h4>
            <img 
            src={editar} 
            className='optionBtnList'
            alt='Canviar estat' 
            title='Canviar estat'
            onClick={()=>{setShippingOrderStateVisible(!shippingOrderStateVisble)}}
            />
            {shippingOrderStateVisble && 
               <div className='shippinOrder_state_change'>
               <label>
                 <input
                   type="radio"
                   value="generat"
                   checked={selectedOption === 'generat'}
                   onChange={(e)=>{
                    setSelectedOption(e.target.value)
                    fnUpdateState(e.target.value)
                    }}
                 />
                 Generat
               </label>
         
               <label>
                 <input
                   type="radio"
                   value="en proces"
                   checked={selectedOption === 'en proces'}
                   onChange={(e)=>{
                    setSelectedOption(e.target.value)
                    fnUpdateState(e.target.value)
                }}
                 />
                 En Procès
               </label>
         
               <label>
                 <input
                   type="radio"
                   value="enviat"
                   checked={selectedOption === 'enviat'}
                   onChange={(e)=>{
                    setSelectedOption(e.target.value)
                    fnUpdateState(e.target.value)
                }}
                 />
                 Enviat
               </label>
             </div>
            }
            <p>{shippingOrderSelected.observations}</p>
            {shippingOrder && shippingOrder.length > 0 && shippingOrder.map((detail, indexComponent)=>(
                <div key={indexComponent} className='shippingOrder_detail'>  
                    <h3>{detail.componentReference}{detail.productReference} - {detail.description} </h3>
                    <h4>Quantitat: {detail.units}</h4>
                    <h4>Processos a realitzar:</h4>
                    {shippingOrderSelected.detail[indexComponent].processes.map((componentProcess, index)=>(
                <div key={index} className='shippingOrder_detail_processes'>
                    <p>{componentProcess.name}</p>
                </div>
            ))}
                </div>
            ))}
            
        </div>
        
    )}
  </div>
  
  )
}

export default ShippingOrder