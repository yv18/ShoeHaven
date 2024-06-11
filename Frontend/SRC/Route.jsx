import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./Components/Home.jsx";
import Register from "./Components/signup.jsx";
import Admin from "./Components/Admin.jsx";


const NotFound = () => <h1>Error 404!</h1>; 

function LinksSetup() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Register />} />
        <Route path="/Admin" element={<Admin />} />
        <Route path="/Men" element={<Admin />} />
        <Route path="/Female" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default LinksSetup;