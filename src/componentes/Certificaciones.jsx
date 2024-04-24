import Section from "./Section";
import LogoutButton from "./LogoutButton";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../Multilenguaje/i18n";

const Certificaciones = () => {
  const { t } = useTranslation("certifications");

  const certificaciones = [
    { id: 1, nombre: "Certificación A", carrera: "Ingenieria Civil" },
    { id: 2, nombre: "Certificación B", carrera: "Ingenieria Comercial" },
    { id: 3, nombre: "Certificación C", carrera: "Carrera 3" },
    { id: 4, nombre: "Certificación D", carrera: "Carrera 4" },
    { id: 5, nombre: "Certificación E", carrera: "Carrera 5" },
    { id: 6, nombre: "Certificación F", carrera: "Carrera 6" },
    { id: 7, nombre: "Certificación G", carrera: "Carrera 7" },
    { id: 8, nombre: "Certificación H", carrera: "Carrera 8" },
  ];

  const [filtroCarrera, setFiltroCarrera] = React.useState("Todas");
  const [busqueda, setBusqueda] = React.useState("");

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
    const nombreNormalized = normalizeString(certificacion.nombre);
    const busquedaNormalized = normalizeString(busqueda);
    return (
      (filtroCarrera === "Todas" || certificacion.carrera === filtroCarrera) &&
      nombreNormalized.includes(busquedaNormalized)
    );
  });

  return (
    <div className="p-2 2 xl:shrink-0">
      <Section
        className="pt-[12rem] -mt-[5.25] md:-mt-0"
        crosses
        crossesOffset="lg:translate-y-[5.25rem]"
        customPaddings
        id="certificaciones"
      >
        <div className="container relative w-full text-center mt-6">
          <h1 className="text-5xl h1 text-center mb-10">
            Encuentra tu certificado
          </h1>
        </div>
        {/* Contenedor principal */}
        <div className="mx-auto container relative w-full h-full flex flex-col md:flex-row items-center justify-center">
          <div className="w-full md:w-auto h-auto relative md:mr-12 md:mt-12">
            <Link to="/dashboard">
              <button
                className="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-lg
            -mt-4 mb-4"
              >
                Sube tu certificado
              </button>
            </Link>
            <div className="bg-slate-800 text-center text-white p-4 rounded-lg">
              <h2 className="text-xl font-bold mb-4">Filtrar por carrera:</h2>
              <input
                type="text"
                placeholder="Buscar por nombre"
                value={busqueda}
                onChange={handleBusquedaChange}
                className="bg-white text-gray-800 rounded-md p-2 mb-4 w-full"
              />
              <ul>
                <li
                  className={`cursor-pointer mb-2 ${
                    filtroCarrera === "Todas" && "font-bold"
                  }`}
                  onClick={() => handleFiltroCarreraChange("Todas")}
                >
                  Todas las carreras
                </li>
                <li
                  className={`cursor-pointer mb-2 ${
                    filtroCarrera === "Ingenieria Civil" && "font-bold"
                  }`}
                  onClick={() => handleFiltroCarreraChange("Ingenieria Civil")}
                >
                  Ingeniería Civil
                </li>
                <li
                  className={`cursor-pointer mb-2 ${
                    filtroCarrera === "Ingenieria Comercial" && "font-bold"
                  }`}
                  onClick={() =>
                    handleFiltroCarreraChange("Ingenieria Comercial")
                  }
                >
                  Ingeniería Comercial
                </li>
                <li
                  className={`cursor-pointer mb-2 ${
                    filtroCarrera === "Carrera 3" && "font-bold"
                  }`}
                  onClick={() => handleFiltroCarreraChange("Carrera 3")}
                >
                  Derecho
                </li>
                <li
                  className={`cursor-pointer mb-2 ${
                    filtroCarrera === "Carrera 4" && "font-bold"
                  }`}
                  onClick={() => handleFiltroCarreraChange("Carrera 4")}
                >
                  Psicología
                </li>
                <li
                  className={`cursor-pointer mb-2 ${
                    filtroCarrera === "Carrera 5" && "font-bold"
                  }`}
                  onClick={() => handleFiltroCarreraChange("Carrera 5")}
                >
                  Periodismo
                </li>
              </ul>
            </div>
          </div>
          {/* Contenido de certificaciones */}
          <div className="border-solid border-4 border-sky-500 bg-white shadow-xl p-4 rounded-lg w-full md:w-3/4 mt-12 md:mt-0">
            {/* Lista de certificaciones filtradas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:grid-cols-4">
              {certificacionesFiltradas.map((certificacion) => (
                <div
                  key={certificacion.id}
                  className="hover:bg-gradient-to-r hover:from-cyan-500/50 hover:to-blue-500/50 bg-slate-300 text-gray-800 rounded-lg p-4"
                >
                  <h3 className="font-bold">{certificacion.nombre}</h3>
                  <p>{certificacion.carrera}</p>
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
