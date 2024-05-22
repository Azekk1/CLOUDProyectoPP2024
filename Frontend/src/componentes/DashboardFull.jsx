import React from "react";
import Sidebar from "./Sidebar";
import { SidebarItems } from "./Sidebar";
import stats from "../otros/stats.png";
import certs from "../otros/cert.png";
import perf from "../otros/perf.png";
import students from "../otros/students.png";
import { Link, Outlet } from "react-router-dom";

const DashboardFull = () => {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <Sidebar>
        <Link to="/dashboard">
          <SidebarItems icon={perf} text="Mi perfil" />
        </Link>
        <Link to="estadisticas">
          <SidebarItems icon={stats} text="Estadísticas" />
        </Link>
        <Link to="tabla-alumnos">
          <SidebarItems icon={students} text="Alumnos (Admin)" />
        </Link>
      </Sidebar>
      <div className="flex-grow ml-6 mt-6">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardFull;
