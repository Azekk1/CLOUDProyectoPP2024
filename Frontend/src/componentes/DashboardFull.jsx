import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { SidebarItems } from "./Sidebar";
import stats from "../otros/stats.png";
import certs from "../otros/cert.png";
import perf from "../otros/perf.png";
import students from "../otros/students.png";
import { Link, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Importa la función jwt_decode para decodificar el token JWT
import { useTranslation } from "react-i18next";
import "../Multilenguaje/i18n";

const DashboardFull = () => {
  const { t } = useTranslation("dashboard");
  const [usuario, setUsuario] = useState({ rol: "" }); // Inicializa con un objeto vacío

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const user_name = decodedToken.sub;

      fetch(`https://127.0.0.1/api/users/${user_name}`)
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
    <div className="flex h-screen w-screen overflow-y-auto">
      <Sidebar>
        <Link to="/dashboard">
          <SidebarItems icon={perf} text={t("profile")} />
        </Link>
        <Link to="estadisticas">
          <SidebarItems icon={stats} text={t("stats")} />
        </Link>
        {usuario.rol === "administrador" && (
          <Link to="tabla-alumnos">
            <SidebarItems icon={students} text={t("students")} />
          </Link>
        )}
        {(usuario.rol === "profesor" || usuario.rol === "administrador") && (
          <Link to="panel-admin">
            <SidebarItems icon={certs} text={t("panel")} />
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
