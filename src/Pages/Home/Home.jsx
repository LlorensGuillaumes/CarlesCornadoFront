import React, { useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();
    const [itemSelected, setItemSelected] = useState();
return (
    <div className="home_container">
    <div className={`link home_item ${itemSelected === 1 ? 'selected' : null}`}>
    <h3 onClick={()=>{
        setItemSelected(1)
    }}>CLIENTS</h3>
    </div>
    <div className={`link home_item ${itemSelected === 2 ? 'selected' : null}`}>
    <h3 onClick={()=>{
        setItemSelected(2)
        navigate('/providers')
    }}>PROVEÏDORS</h3>
    </div>
    <div className={`link home_item ${itemSelected === 3 ? 'selected' : null}`}>
    <h3 onClick={()=>{
        setItemSelected(3)
        navigate('/components')
    }}>COMPONENTS</h3>
    </div>
    <div className={`link home_item ${itemSelected === 4 ? 'selected' : null}`}>
    <h3 onClick={()=>{
        setItemSelected(4)
        navigate('/products')}}>PRODUCTES</h3>
    </div>
    <div className={`link home_item ${itemSelected === 5 ? 'selected' : null}`}>
    <h3 onClick={()=>{
        setItemSelected(5)
        }}>FACTURES</h3>
    </div>
    <div className={`link home_item ${itemSelected === 6 ? 'selected' : null}`}>
    <h3 onClick={()=>{
        setItemSelected(6)
        navigate('/processes')}}>PROCESSOS</h3>
    </div>
    <div className={`link home_item ${itemSelected === 7 ? 'selected' : null}`}>
    <h3 onClick={()=>{
        setItemSelected(7)
        navigate('/supplies')}}>APROVISIONAMENTS</h3>
    </div>
    <div className={`link home_item ${itemSelected === 8 ? 'selected' : null}`}>
    <h3 onClick={()=>{
        setItemSelected(8)
        navigate('/purchase_order')}}>ORDRES DE COMPRA</h3>
    </div>
    <div className={`link home_item ${itemSelected === 9 ? 'selected' : null}`}>
    <h3 onClick={()=>{
        setItemSelected(9)
        navigate('/assembly_order')}}>ORDRES DE MUNTATGE</h3>
    </div>
    </div>
    );
};

export default Home;
