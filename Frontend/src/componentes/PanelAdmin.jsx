import React, { useState, useEffect } from "react";
import axios from "axios";

const PanelAdmin = () => {
  const [tipoValidaciones, setTipoValidaciones] = useState({}); // Estado para los tipos de validación por certificado
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await axios.get(
          "https://localhost:5000/api/certificates"
        );
        if (!response.data) {
          throw new Error("Error al cargar los certificados");
        }
        setCertificates(response.data);
        // Inicializar los estados de tipo de validación para cada certificado
        const initialValidations = {};
        response.data.forEach((certificate) => {
          initialValidations[certificate.certificate_id] = null; // Inicialmente ningún tipo de validación seleccionado
        });
        setTipoValidaciones(initialValidations);
      } catch (error) {
        console.error("Error al cargar los certificados:", error);
      }
    };

    fetchCertificates();
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

  return (
    <div className="container mx-auto p-6 bg-background rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold text-text mb-6 text-center">
        Panel de Administración
      </h1>

      <div>
        <h2 className="text-2xl font-semibold text-text mb-4">
          Certificaciones
        </h2>
      </div>

      <div className="grid gap-4">
        {certificates.map((certificate) => (
          <div
            key={certificate.certificate_id}
            className="bg-secondary p-2 rounded-md border border-primary"
          >
            <h2 className="text-lg font-semibold text-text mb-1">
              Certificación: {certificate.certificate_name}
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
                Manual
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
                Automática
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PanelAdmin;
