import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home/Home";
import Providers from "./Pages/Providers/Providers";
import Components from "./Pages/Components/Components";
import Processes from "./Pages/Processes/Processes";
import Header from "./Pages/Header/Header";
import Products from "./Pages/Products/Products";
import Suplies from "./Pages/Supplies/Suplies";

function App() {
  return (
    <Router>
    <Header/>

      <div className="App">
      
        <Routes>
        
          <Route path="/providers" element={<Providers />} />
          <Route path="/components" element={<Components/>}/>
          <Route path="/processes" element={<Processes/>}/>
          <Route path="/products" element={<Products/>}/>
          <Route path="/supplies" element={<Suplies/>}/>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
