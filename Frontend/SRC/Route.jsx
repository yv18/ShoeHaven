import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./Components/Home.jsx";
import Register from "./Components/signup.jsx";
import Admin from "./Components/Admin.jsx";
import Product from "./Components/ProductAdmin.jsx";
import ManageOrder from "./Components/Admin/ManageOrder.jsx";
import Store from "./Components/StorePage.jsx";
import OrderPage from "./Components/Order.jsx";
import Cart from "./Components/Cart.jsx";
import Checkout from "./Components/Checkout.jsx";
import ReturnOrderPage from "./Components/Admin/ReturnOrder.jsx";
import AdminLogin from "./Components/Admin/AdminLogin.jsx";
import AdminNav from "./Components/Admin/AdminNav.jsx";
import Wishlist from "./Components/wishlist.jsx";




const NotFound = () => <h1>Error 404!</h1>; 

function LinksSetup() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Register />} />
        <Route path="/Admin" element={<Admin />} />
        <Route path="/Men" element={<Admin />} />
        <Route path="/Admin" element={<Admin />} />
        <Route path="/OrderPage" element={<OrderPage />} />
        <Route path="/Product" element={<Product />} />
        <Route path="/ManageOrder" element={<ManageOrder />} />
        <Route path="/Store" element={<Store />} />
        <Route path="/Cart" element={<Cart/>} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/Return" element={<ReturnOrderPage/>} />
        <Route path="/AdminLogin" element={<AdminLogin/>} />
        <Route path="/AdminNav" element={<AdminNav/>} />
        <Route path="/Wishlist" element={<Wishlist />} />
        <Route path="*" element={<NotFound />} />
 
        
      </Routes>
    </BrowserRouter>
  );
}

export default LinksSetup;
