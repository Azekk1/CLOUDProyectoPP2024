import Button from "./componentes/Button";
import Header from "./componentes/Header";
import Home from "./componentes/Home";
import Footer from "./componentes/Footer";
import Dashboard from "./componentes/Dashboard";
import { Route, Routes, Navigate } from "react-router-dom";
import Certificaciones from "./componentes/Certificaciones";
import Login from "./componentes/Login";
import LanguageSwitcher from "./componentes/LanguageSwitcher";
import campus from "./otros/UAICAMPUS.jpg";
import React, { useState } from 'react';
import LogoutButton from "./componentes/LogoutButton";

const App = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('token'));
  console.log(localStorage.getItem('token'));

  return (
    <>
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden w-screen">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} /> 
          <Route path="/certificaciones" element={isAuthenticated ? <Certificaciones /> : <Navigate to="/login" />} />
          <Route path="/redirect" element={isAuthenticated ? <Navigate to="/" /> : null} />
          <Route path="/language" element={<LanguageSwitcher />} />
        </Routes>
        <Footer />
      </div>
    </>
  );
};

export default App;
