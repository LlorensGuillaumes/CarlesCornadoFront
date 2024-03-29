import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home/Home";
import Providers from "./Pages/Providers/Providers";
import Components from "./Pages/Components/Components";
import Processes from "./Pages/Processes/Processes";
import Header from "./Pages/Header/Header";
import Products from "./Pages/Products/Products";
import Suplies from "./Pages/Supplies/Suplies";
import PurchaseOrder from "./Pages/PurchaseOrder/PurchaseOrder";
import AssemblyOrder from "./Pages/AssemblyOrder/AssemblyOrder";
import Customers from "./Pages/Customers/Customers";
import ShippingOrder from "./Pages/ShippingOrder/ShippingOrder";

function App() {
  return (
    <Router>
      <Header />

      <div className="App">
        <div className="left-column">
          <Home />
        </div>

        <div className="right-column">
          <Routes>
            <Route path="/providers" element={<Providers />} />
            <Route path="/components" element={<Components />} />
            <Route path="/processes" element={<Processes />} />
            <Route path="/products" element={<Products />} />
            <Route path="/supplies" element={<Suplies />} />
            <Route path="/purchase_order" element={<PurchaseOrder />} />
            <Route path="/assembly_order" element={<AssemblyOrder/>}/>
            <Route path="/customers" element={<Customers/>}/>
            <Route path="/shipping_orders" element={<ShippingOrder/>}/>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

