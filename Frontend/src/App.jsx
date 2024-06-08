// App.js
import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Header from "./componentes/Header";
import Home from "./componentes/Home";
import Footer from "./componentes/Footer";
import DashboardFull from "./componentes/DashboardFull";
import Certificaciones from "./componentes/Certificaciones";
import Login from "./componentes/Login";
import LogoutButton from "./componentes/LogoutButton";
import Perfil from "./componentes/Perfil";
import Estadisticas from "./componentes/Estadisticas";
import TablaDashboard from "./componentes/TablaDashboard";
import Subircerts from "./componentes/Subircerts";
import PanelAdmin from "./componentes/PanelAdmin";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("token")
  );

  // Función para verificar si el token ha expirado
  const isTokenExpired = () => {
    const expirationTime = localStorage.getItem("expirationTime");
    if (!expirationTime) {
      return true; // Si no hay una fecha de expiración, consideramos que el token ha expirado
    }
    return new Date() > new Date(expirationTime); // Comparamos la fecha actual con la fecha de expiración
  };

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
      <div className="pt-[2.75rem] lg:pt-[4.25rem] overflow-hidden w-screen bg-background">
        <Header isAuthenticated={isAuthenticated} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={<Login setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? <DashboardFull /> : <Navigate to="/login" />
            }
          >
            <Route
              index
              element={isAuthenticated ? <Perfil /> : <Navigate to="/login" />}
            />
            <Route
              path="estadisticas"
              element={
                isAuthenticated ? <Estadisticas /> : <Navigate to="/login" />
              }
            />
            <Route
              path="subir-certificaciones"
              element={
                isAuthenticated ? <Subircerts /> : <Navigate to="/login" />
              }
            />
            <Route
              path="tabla-alumnos"
              element={
                isAuthenticated ? <TablaDashboard /> : <Navigate to="/login" />
              }
            />
            <Route
              path="panel-admin"
              element={
                isAuthenticated ? <PanelAdmin /> : <Navigate to="/login" />
              }
            />
          </Route>
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
