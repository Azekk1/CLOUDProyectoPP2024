import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const PanelAdmin = () => {
  const [certificaciones, setCertificaciones] = useState([]);
  const [carreraUsuario, setCarreraUsuario] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const user_name = decodedToken.sub;

      fetch(`http://localhost:4000/api/users/${user_name}`)
        .then((response) => response.json())
        .then((data) => {
          setCarreraUsuario(data.career_name);
        })
        .catch((error) => console.error("Error fetching user data:", error));
    }
  }, []);

  useEffect(() => {
    if (carreraUsuario) {
      fetch(`http://localhost:4000/api/certifications/${carreraUsuario}`)
        .then((response) => response.json())
        .then((data) => {
          setCertificaciones(data);
        })
        .catch((error) =>
          console.error("Error fetching certifications:", error)
        );
    }
  }, [carreraUsuario]);

  return (
    <div className="container mx-auto p-6 bg-background rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold text-text mb-6 justify-center text-center">
        Panel de Administración
      </h1>

      <div>
        <h2 className="text-2xl font-semibold text-text mb-4">
          Certificaciones
        </h2>
        <ul>
          {certificaciones.map((certificacion) => (
            <li
              key={certificacion.id}
              className="mb-4 p-4 border rounded-md bg-secondary"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">{certificacion.nombre}</h3>
                  <p>{certificacion.carrera}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PanelAdmin;
