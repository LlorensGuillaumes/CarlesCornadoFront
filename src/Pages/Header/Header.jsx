import React from 'react';
import "./Header.css";
import logo from "../../Images/logo.jpg";

const Header = () => {
return (
    <div className='logo-container'>
    <img src={logo} alt='Logo'/>
    </div>

)
}

export default Header