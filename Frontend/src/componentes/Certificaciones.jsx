import Section from "./Section";
import LogoutButton from "./LogoutButton";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import React, { useState, useEffect } from "react";
import "../Multilenguaje/i18n";

const Certificaciones = () => {
  const { t, i18n } = useTranslation("certifications");

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

  // Estado local para almacenar las certificaciones
  const [certificaciones, setCertificaciones] = useState([]);

  // Estado para manejar el filtro de carrera y búsqueda
  const [filtroCarrera, setFiltroCarrera] = useState("Todas");
  const [busqueda, setBusqueda] = useState("");

  // Función para hacer la solicitud a la API y actualizar el estado
  useEffect(() => {
    const fetchCertificaciones = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/certificates"); // Actualizar la URL del backend en Azure
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json(); // Convertir la respuesta a formato JSON
        console.log("Datos recibidos del servidor:", data);
        setCertificaciones(data); // Actualizar el estado con los datos recibidos
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCertificaciones(); // Llamar a la función para hacer la solicitud cuando el componente se monte
  }, []);

  const handleFiltroCarreraChange = (carrera) => {
    setFiltroCarrera(carrera);
  };

  const handleBusquedaChange = (event) => {
    setBusqueda(event.target.value);
  };

  const normalizeString = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  const certificacionesFiltradas = certificaciones.filter((certificacion) => {
    const nombre = certificacion.certificate_name || "";
    const busquedaNormalized = normalizeString(busqueda);
    const nombreNormalized = normalizeString(nombre);
    return (
      (filtroCarrera === "Todas" || certificacion.carrera === filtroCarrera) &&
      nombreNormalized.includes(busquedaNormalized)
    );
  });

  console.log("Certificaciones filtradas:", certificacionesFiltradas);

  return (
    <div className="p-2 2 xl:shrink-0 mb-12">
      <Section
        className="pt-[12rem] -mt-[5.25] md:-mt-0"
        crosses
        crossesOffset="lg:translate-y-[5.25rem]"
        customPaddings
        id="certificaciones"
      >
        <div className="container relative w-full text-center mt-6">
          <h1 className="text-text text-5xl h1 text-center mb-10">
            {t("find")}
          </h1>
        </div>
        {/* Contenedor principal */}
        <div className="mx-0 container relative w-full h-full flex flex-col md:flex-row items-center justify-center">
          <div className="w-full md:w-auto h-auto relative md:mr-12 md:mt-12">
            <Link to="/dashboard">
              <button
                className="transition-colors bg-accent hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg
            -mt-4 mb-4"
              >
                {t("submit")}
              </button>
            </Link>
            <div className="shadow-xl border-secondary border-4 text-center text-text p-4 rounded-xl">
              <h2 className="text-xl font-bold mb-4 bg-secondary p-1 rounded-lg">
                {t("filter")}
              </h2>
              <input
                type="text"
                placeholder={t("search")}
                value={busqueda}
                onChange={handleBusquedaChange}
                className="bg-background text-text rounded-md p-2 mb-4 w-full border-secondary border-2"
              />
              <ul className="bg-secondary rounded-lg p-1">
                <li
                  className={`cursor-pointer border-b-2 border-primary/20 mb-2 ${
                    filtroCarrera === "Todas" && "font-bold"
                  }`}
                  onClick={() => handleFiltroCarreraChange("Todas")}
                >
                  {t("every")}
                </li>
                <li
                  className={`cursor-pointer border-b-2 border-primary/20 my-2 ${
                    filtroCarrera === "Ingenieria Civil" && "font-bold"
                  }`}
                  onClick={() => handleFiltroCarreraChange("Ingenieria Civil")}
                >
                  {t("civil")}
                </li>
                <li
                  className={`cursor-pointer border-b-2 border-primary/20 my-2 ${
                    filtroCarrera === "Ingenieria Comercial" && "font-bold"
                  }`}
                  onClick={() =>
                    handleFiltroCarreraChange("Ingenieria Comercial")
                  }
                >
                  {t("commercial")}
                </li>
                <li
                  className={`cursor-pointer border-b-2 border-primary/20 my-2 ${
                    filtroCarrera === "Derecho" && "font-bold"
                  }`}
                  onClick={() => handleFiltroCarreraChange("Derecho")}
                >
                  {t("law")}
                </li>
                <li
                  className={`cursor-pointer border-b-2 border-primary/20 my-2 ${
                    filtroCarrera === "Psicologia" && "font-bold"
                  }`}
                  onClick={() => handleFiltroCarreraChange("Psicologia")}
                >
                  {t("psychology")}
                </li>
                <li
                  className={`cursor-pointer mb-1 ${
                    filtroCarrera === "Periodismo" && "font-bold"
                  }`}
                  onClick={() => handleFiltroCarreraChange("Periodismo")}
                >
                  {t("journalism")}
                </li>
              </ul>
            </div>
          </div>
          {/* Contenido de certificaciones */}
          <div className="border-solid border-2 border-accent bg-background shadow-xl p-4 rounded-xl w-full md:w-3/4 mt-12 md:mt-0">
            {/* Lista de certificaciones filtradas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:grid-cols-4">
              {certificacionesFiltradas.map((certificacion, index) => (
                <div
                  key={certificacion.certificate_id || index}
                  className="hover:transition-all duration-500 hover:bg-accent bg-secondary text-text rounded-lg p-4"
                >
                  <h3 className="font-bold">
                    {certificacion.certificate_name}
                  </h3>
                  <p>
                    {carreraTranslations[i18n.language][
                      certificacion.carrera
                    ] || certificacion.carrera}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default Certificaciones;
