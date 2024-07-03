import React, { useState, useEffect } from "react";
import axios from "axios";




const decodeJWT = (token) => {
  try {
    const base64Url = token.split(".")[1]; // Obtiene la parte del payload del token
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/"); // Reemplaza caracteres URL-safe
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Error decodificando el JWT:", e);
    return null;
  }
};

const PanelAdmin = () => {
  const [tipoValidaciones, setTipoValidaciones] = useState({});
  const [certificates, setCertificates] = useState([]);
  const [rejectedCertificates, setRejectedCertificates] = useState([]);
  const [userRole, setUserRole] = useState(null); // Estado para el rol del usuario

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        // Simular la obtención y decodificación del JWT token
        const token = localStorage.getItem("jwtToken"); // Obtén el token desde donde lo tengas almacenado
        const decoded = decodeJWT(token);
        const rol = decoded.role_id; // Suponiendo que 'rol_id' es la clave correcta para obtener el rol del token

        setUserRole(rol); // Establece el estado del rol del usuario
      } catch (error) {
        console.error("Error al cargar el rol del usuario:", error);
      }
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await axios.get(
          "http://139.59.134.160:5000/api/certificates"
        );
        if (!response.data) {
          throw new Error("Error al cargar los certificados");
        }
        setCertificates(response.data);
        // Inicializar los estados de tipo de validación para cada certificado
        const initialValidations = {};
        response.data.forEach((certificate) => {
          initialValidations[certificate.certificate_id] = null;
        });
        setTipoValidaciones(initialValidations);
      } catch (error) {
        console.error("Error al cargar los certificados:", error);
      }
    };

    fetchCertificates();
  }, []);

  useEffect(() => {
    const fetchRejectedCertificates = async () => {
      try {
        const response = await axios.get(
          "http://tu-backend.com/api/rejected-certificates"
        );
        if (!response.data) {
          throw new Error("Error al cargar los certificados rechazados");
        }
        setRejectedCertificates(response.data);
      } catch (error) {
        console.error("Error al cargar los certificados rechazados:", error);
      }
    };

    fetchRejectedCertificates();
  }, []);

  const handleSelectManual = (certificateId) => {
    setTipoValidaciones((prevValidations) => ({
      ...prevValidations,
      [certificateId]:
        prevValidations[certificateId] !== "manual" ? "manual" : null,
    }));
  };

  const handleSelectAutomatica = (certificateId) => {
    setTipoValidaciones((prevValidations) => ({
      ...prevValidations,
      [certificateId]:
        prevValidations[certificateId] !== "automatica" ? "automatica" : null,
    }));
  };

  if (userRole !== 2 && userRole !== 3) {
    return null; // No renderizar nada si el rol del usuario no es 2 o 3
  }

  return (
    <div className="container mx-auto p-6 bg-background rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold text-text mb-6 text-center">
        {t("panel")}
      </h1>

      <div>
        <h2 className="text-2xl font-semibold text-text mb-4">
          {t("certificates")}
        </h2>
      </div>

      <div className="grid gap-4">
        {certificates.map((certificate) => (
          <div
            key={certificate.certificate_id}
            className="bg-secondary p-2 rounded-md border border-primary"
          >
            <h2 className="text-lg font-semibold text-text mb-1">
              {t("certificate")}: {certificate.certificate_name}
            </h2>
            <div className="flex space-x-2">
              <button
                className={`flex-1 p-2 text-center ${
                  tipoValidaciones[certificate.certificate_id] === "manual"
                    ? "bg-sky-500 text-white rounded-md"
                    : "bg-gray-200 text-text"
                }`}
                onClick={() => handleSelectManual(certificate.certificate_id)}
              >
                {t("manual")}
              </button>
              <button
                className={`flex-1 p-2 text-center ${
                  tipoValidaciones[certificate.certificate_id] === "automatica"
                    ? "bg-sky-500 text-white rounded-md"
                    : "bg-gray-200 text-text"
                }`}
                onClick={() =>
                  handleSelectAutomatica(certificate.certificate_id)
                }
              >
                {t("auto")}
              </button>
            </div>
          </div>
        ))}

        <div>
          <h2 className="text-2xl font-semibold text-text mt-8 mb-4">
            Certificados Rechazados
          </h2>
        </div>

        {rejectedCertificates.length > 0 ? (
          <div className="grid gap-4">
            {rejectedCertificates.map((certificate) => (
              <div
                key={certificate.certificate_id}
                className="bg-secondary p-2 rounded-md border border-primary"
              >
                <h2 className="text-lg font-semibold text-text mb-1">
                  Certificación: {certificate.certificate_name}
                </h2>
                <p className="text-text mb-1">
                  Subido por: {certificate.user_name} el{" "}
                  {new Date(certificate.upload_time).toLocaleDateString()}
                </p>
                <a
                  href={`http://tu-backend.com/api/download/${certificate.file_path}`}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md inline-block"
                  download
                >
                  Descargar Certificado
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-text">No hay certificados rechazados disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default PanelAdmin;

