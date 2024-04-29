import React from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import "../Multilenguaje/i18n";

const LogoutButton = () => {
  const { t } = useTranslation("logout");

  const handleLogout = async () => {
    try {
      // Envía una solicitud al backend para cerrar sesión
      await axios.post("http://localhost:5000/logout");

      // Eliminar el token de acceso del localStorage
      localStorage.removeItem("token");
      console.log("Token: ", localStorage.getItem("token"));

      // Redirigir a la página de inicio de sesión o a otra página
      window.location.href = "/login";
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <button onClick={handleLogout} className="ml-10">
      {t("logout")}
    </button>
  );
};

export default LogoutButton;
