import Button from "./componentes/Button";
import Header from "./componentes/Header";
import Home from "./componentes/Home";
import Footer from "./componentes/Footer";
import Dashboard from "./componentes/Dashboard";
import { Route, Routes, Navigate } from "react-router-dom";
import Certificaciones from "./componentes/Certificaciones";
import Login from "./componentes/Login";
import React, { useState, useEffect } from "react";
import LogoutButton from "./componentes/LogoutButton";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("token")
  );

   // Función para verificar si el token ha expirado
   const isTokenExpired = () => {
    const expirationTime = localStorage.getItem('expirationTime');
    if (!expirationTime) {
        return true; // Si no hay una fecha de expiración, consideramos que el token ha expirado
    }
    return new Date() > new Date(expirationTime); // Comparamos la fecha actual con la fecha de expiración
  }

  useEffect(() => {
    if (isAuthenticated && isTokenExpired()) {
      // Si el usuario está autenticado pero el token ha expirado, eliminamos el token y actualizamos el estado de autenticación
      localStorage.removeItem("token");
      localStorage.removeItem("expirationTime");
      setIsAuthenticated(false);
    }
  }, [isAuthenticated]);

  console.log(localStorage.getItem("token"));

  return (
    <>
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden w-screen">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={<Login setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
          />
          <Route
            path="/certificaciones"
            element={
              isAuthenticated ? <Certificaciones /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/redirect"
            element={isAuthenticated ? <Navigate to="/" /> : null}
          />
        </Routes>
        <Footer />
      </div>
    </>
  );
};

export default App;
