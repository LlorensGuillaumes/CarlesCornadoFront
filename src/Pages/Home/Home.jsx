import React from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();
return (
    <div>
    <div className="link">
    <h1>CLIENTS</h1>
    </div>
    <div className="link">
    <h1 onClick={()=>{
        navigate('/providers')
    }}>PROVEÏDORS</h1>
    </div>
    <div className="link">
    <h1 onClick={()=>{navigate('/components')}}>COMPONENTS</h1>
    </div>
    <div className="link">
    <h1 onClick={()=>{navigate('/products')}}>PRODUCTES</h1>
    </div>
    <div className="link">
    <h1>FACTURES</h1>
    </div>
    <div className="link">
    <h1 onClick={()=>{navigate('/processes')}}>PROCESSOS</h1>
    </div>
    </div>
    );
};

export default Home;
