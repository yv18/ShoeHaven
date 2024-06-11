import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./Components/Home.jsx";


const NotFound = () => <h1>Error 404!</h1>; //this will display error when  the user enters an incorrect route

function LinksSetup() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default LinksSetup;