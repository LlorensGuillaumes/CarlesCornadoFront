import React from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();
return (
    <div className="home_container">
    <div className="link home_item">
    <h3>CLIENTS</h3>
    </div>
    <div className="link home_item">
    <h3 onClick={()=>{
        navigate('/providers')
    }}>PROVEÏDORS</h3>
    </div>
    <div className="link home_item">
    <h3 onClick={()=>{navigate('/components')}}>COMPONENTS</h3>
    </div>
    <div className="link home_item">
    <h3 onClick={()=>{navigate('/products')}}>PRODUCTES</h3>
    </div>
    <div className="link home_item">
    <h3>FACTURES</h3>
    </div>
    <div className="link home_item">
    <h3 onClick={()=>{navigate('/processes')}}>PROCESSOS</h3>
    </div>
    <div className="link home_item">
    <h3 onClick={()=>{navigate('/supplies')}}>APROVISIONAMENTS</h3>
    </div>
    <div className="link home_item">
    <h3 onClick={()=>{navigate('/purchase_order')}}>ORDRES DE COMPRA</h3>
    </div>
    </div>
    );
};

export default Home;
