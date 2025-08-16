// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import OtpPage from "./pages/otp";

import Home from "./pages/Home";

import CategoryPage from "./pages/CategoryPage";
import ProductDetails from "./pages/ProductDetails";


import AddProduct from './admin/AddProduct';

import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-otp" element={<OtpPage />} />
          <Route path="/home" element={<Home />} />

          {/* Updated Route */}
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/product/:productId" element={<ProductDetails />} />
           
        
         
          
          <Route path="/admin/add-product" element={<AddProduct />} />
        

        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
