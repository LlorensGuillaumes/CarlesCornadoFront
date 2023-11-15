import React from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();
return (
    <div className="home_container">
    <div className="link home_item">
    <h1>CLIENTS</h1>
    </div>
    <div className="link home_item">
    <h1 onClick={()=>{
        navigate('/providers')
    }}>PROVEÏDORS</h1>
    </div>
    <div className="link home_item">
    <h1 onClick={()=>{navigate('/components')}}>COMPONENTS</h1>
    </div>
    <div className="link home_item">
    <h1 onClick={()=>{navigate('/products')}}>PRODUCTES</h1>
    </div>
    <div className="link home_item">
    <h1>FACTURES</h1>
    </div>
    <div className="link home_item">
    <h1 onClick={()=>{navigate('/processes')}}>PROCESSOS</h1>
    </div>
    </div>
    );
};

export default Home;
