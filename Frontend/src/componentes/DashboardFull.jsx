import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { SidebarItems } from "./Sidebar";
import stats from "../otros/stats.png";
import certs from "../otros/cert.png";
import perf from "../otros/perf.png";
import students from "../otros/students.png";
import { Link, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Importa la función jwt_decode para decodificar el token JWT

const DashboardFull = () => {
  const [usuario, setUsuario] = useState({ rol: "" }); // Inicializa con un objeto vacío

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const user_name = decodedToken.sub;

      fetch(`http://localhost:4000/api/users/${user_name}`)
        .then((response) => response.json())
        .then((data) => {
          setUsuario({
            rol: data.role_name,
          });
        })
        .catch((error) => console.error("Error fetching user data:", error));
    }
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar>
        <Link to="/dashboard">
          <SidebarItems icon={perf} text="Mi perfil" />
        </Link>
        <Link to="estadisticas">
          <SidebarItems icon={stats} text="Estadísticas" />
        </Link>
        {usuario.rol === "administrador" && (
          <Link to="tabla-alumnos">
            <SidebarItems icon={students} text="Alumnos (Admin)" />
          </Link>
        )}
        {(usuario.rol === "profesor" || usuario.rol === "administrador") && (
          <Link to="panel-admin">
            <SidebarItems icon={certs} text="Panel de Administración" />
          </Link>
        )}
      </Sidebar>
      <div className="flex-grow ml-6 mt-6">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardFull;
