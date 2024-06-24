import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../Multilenguaje/i18n";

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

const Popup = ({ show, onClose, onAddCert, userId, certificateId }) => {
  // Cambiado certificateName a certificateId
  if (!show) {
    return null;
  }

  const { t } = useTranslation("dashboard");

  const [selectedFile, setSelectedFile] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [certificate_id, setCertificateid] = useState(""); // Esto podría necesitar ser cambiado o eliminado dependiendo de su uso

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await fetch("http://127.0.0.1:4000/api/certificates");
        if (!response.ok) {
          throw new Error("Error al cargar los certificados");
        }
        const data = await response.json();
        setCertificates(data);
      } catch (error) {
        console.error("Error al cargar los certificados:", error);
      }
    };

    fetchCertificates();
  }, []);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert("Por favor, selecciona un archivo primero.");
      return;
    }
    console.log("al comienzo", certificate_id);
    if (!certificate_id) {
      alert("Por favor, selecciona un certificado.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("No se encontró el token de autenticación.");
      return;
    }

    alert("antes de decodificar");
    console.log(token);

    const decoded = decodeJWT(token);
    const userId = decoded.user_id;
    alert("se descifro el token");

    console.log("segundo", certificate_id); // Cambiado de certificateName a certificateId
    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("certificate_name", certificate_id); // Cambiado de certificateName a certificateId
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://127.0.0.1:3000/dashboard", {
        method: "POST",
        body: formData,
      });
      alert("se hizo la solicitud");

      if (!response.ok) {
        throw new Error("Error al subir el archivo");
      }

      const result = await response.json();
      console.log(result);
      onClose(); // Considera llamar a onAddCert si necesitas actualizar algún estado externo
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      alert("Error al subir el archivo. Por favor, intenta de nuevo.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-primary bg-opacity-50 z-50">
      <div className="bg-background p-8 rounded-lg" style={{ zIndex: 51 }}>
        <h2 className="text-2xl font-bold mb-4 text-text">
          Subir Certificación
        </h2>
        <select
          value={certificate_id}
          onChange={(e) => setCertificateid(e.target.value)}
          className="mb-4 p-2 w-full border rounded-md"
        >
          <option value="">{t("select_certificate")}</option>
          {certificates.map((cert) => (
            <option key={cert.certificate_id} value={cert.certificateId}>
              {cert.certificate_name}
            </option>
          ))}
        </select>
        <label
          htmlFor="fileInput"
          className="transition-all bg-gray-500 cursor-pointer hover:bg-secondary text-white font-bold py-2 px-4 rounded-xl mr-4"
        >
          {t("select_file")}
        </label>
        <input
          type="file"
          id="fileInput"
          className="mb-4"
          style={{ visibility: "hidden" }}
          onChange={handleFileChange}
        />
        {selectedFile && <p className="text-gray-700">{selectedFile.name}</p>}
        <div className="flex justify-end">
          <button
            className="transition-colors bg-accent hover:bg-accent/70 text-white px-4 py-2 rounded mr-2"
            onClick={onClose}
          >
            {t("cancel")}
          </button>
          <button
            className="transition-colors bg-primary/80 hover:bg-primary/50 text-white px-4 py-2 rounded"
            onClick={handleSubmit}
          >
            {t("submit")}
          </button>
        </div>
      </div>
    </div>
  );
};

const CarruselCertificaciones = ({ certificaciones, onAddCert }) => {
  const { t } = useTranslation("dashboard");
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? certificaciones.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === certificaciones.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-semibold text-text">
        {t("certifications")}
      </h3>
      <div className="relative mt-4">
        {certificaciones.length > 0 ? (
          <div className="flex items-center">
            <button
              className="absolute left-0 bg-primary text-white p-2 rounded-full"
              onClick={handlePrev}
            >
              &lt;
            </button>
            <div className="mx-8 flex-grow p-4 bg-secondary rounded-lg border border-accent text-text text-center">
              <h4 className="text-xl font-semibold">
                {certificaciones[currentIndex].titulo}
              </h4>
              <p className="text-text">{certificaciones[currentIndex].fecha}</p>
            </div>
            <button
              className="absolute right-0 bg-primary text-white p-2 rounded-full"
              onClick={handleNext}
            >
              &gt;
            </button>
          </div>
        ) : (
          <p className="text-text">{t("no_certifications")}</p>
        )}
        <div
          className="mt-4 p-4 bg-secondary rounded-lg border border-accent text-text cursor-pointer flex items-center justify-center"
          onClick={onAddCert}
        >
          <span className="mr-2">{t("add")}</span>
          <span className="text-2xl font-bold">+</span>
        </div>
      </div>
    </div>
  );
};

const Perfil = () => {
  const { t, i18n } = useTranslation("dashboard");
  const [usuario, setUsuario] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  // Definir traducciones de carreras según el idioma actual
  const carreraTranslations = {
    es: {
      "Ingenieria Civil": t("Ingenieria Civil"),
      "Ingenieria Comercial": t("Ingenieria Comercial"),
      Derecho: t("Derecho"),
      Psicologia: t("Psicologia"),
      Periodismo: t("Periodismo"),
      // Añadir más traducciones según sea necesario
    },
    en: {
      "Ingenieria Civil": "Civil Engineering",
      "Ingenieria Comercial": "Commercial Engineering",
      Derecho: "Law",
      Psicologia: "Psychology",
      Periodismo: "Journalism",
      // Añadir más traducciones según sea necesario
    },
  };

  const rolTranslations = {
    es: {
      alumno: "Alumno",
      profesor: "Profesor",
      administrador: "Administrador",
    },
    en: {
      alumno: "Student",
      profesor: "Teacher",
      administrador: "Admin",
    },
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = decodeJWT(token);
      const user_name = decodedToken.sub;

      fetch(`http://localhost:4000/api/users/${user_name}`)
        .then((response) => response.json())
        .then((data) => {
          setUsuario({
            nombre: `${data.names} ${data.lastnames}`,
            correo: data.user_name,
            rol: data.role_name,
            carrera: data.career_name,
            generacion: data.entry_year,
            foto: "https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg",
            certificaciones: [], // Asume que debes llenar esto con datos reales
          });
        })
        .catch((error) => console.error("Error fetching user data:", error));
    }
  }, []);

  if (!usuario) {
    return <div>Loading...</div>;
  }

  const agregarCertificacion = (certificacion) => {
    setUsuario((prevUsuario) => ({
      ...prevUsuario,
      certificaciones: [...prevUsuario.certificaciones, certificacion],
    }));
  };

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 bg-background rounded-lg shadow-lg">
      <div className="flex items-center space-x-6">
        <img
          className="w-32 h-32 rounded-full object-cover"
          src={usuario.foto}
          alt="Foto de perfil"
        />
        <div>
          <h2 className="text-3xl font-semibold text-gray-800">
            {usuario.nombre}
          </h2>
          <p className="text-text">{usuario.correo}</p>
          <p className="text-text">
            {carreraTranslations[i18n.language][usuario.carrera]}
          </p>
          {usuario.rol === "profesor" ? (
            <p className="text-text">
              {t("teacher")}
              {usuario.generacion}
            </p>
          ) : (
            <p className="text-text">
              {t("generation")} {usuario.generacion}
            </p>
          )}
          <p className="text-text font-semibold">
            {rolTranslations[i18n.language][usuario.rol]}
          </p>
        </div>
      </div>
      <CarruselCertificaciones
        certificaciones={usuario.certificaciones}
        onAddCert={() => setShowPopup(true)}
      />
      <Popup
        show={showPopup}
        onClose={() => setShowPopup(false)}
        onAddCert={agregarCertificacion}
      />
    </div>
  );
};

export default Perfil;
