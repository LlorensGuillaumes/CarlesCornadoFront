import React from 'react';
import "./Header.css";
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
return (
<div onClick={()=>{navigate('/')}} className='link'>HOME</div>
)
}

export default Header