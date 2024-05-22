import React, { useState } from "react";

const Popup = ({ show, onClose, onAddCert }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [certName, setCertName] = useState("");

  if (!show) return null;

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleSubmit = () => {
    if (certName && selectedFile) {
      onAddCert({
        id: Date.now(),
        titulo: certName,
        fecha: new Date().toLocaleDateString(),
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-primary bg-opacity-50 z-50">
      <div className="bg-background p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-text">
          Subir Certificación
        </h2>
        <input
          type="text"
          placeholder="Nombre de la certificación"
          value={certName}
          onChange={(e) => setCertName(e.target.value)}
          className="mb-4 p-2 w-full border rounded-md"
        />
        <label
          htmlFor="fileInput"
          className="transition-all bg-gray-500 cursor-pointer hover:bg-secondary text-white font-bold py-2 px-4 rounded-xl mr-4"
        >
          Seleccionar archivo
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
            Cancelar
          </button>
          <button
            className="transition-colors bg-primary/80 hover:bg-primary/50 text-white px-4 py-2 rounded"
            onClick={handleSubmit}
          >
            Subir
          </button>
        </div>
      </div>
    </div>
  );
};

const CarruselCertificaciones = ({ certificaciones, onAddCert }) => {
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
      <h3 className="text-2xl font-semibold text-text">Certificaciones</h3>
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
          <p className="text-text">No hay certificaciones disponibles</p>
        )}
        <div
          className="mt-4 p-4 bg-secondary rounded-lg border border-accent text-text cursor-pointer flex items-center justify-center"
          onClick={onAddCert}
        >
          <span className="mr-2">Añadir certificación</span>
          <span className="text-2xl font-bold">+</span>
        </div>
      </div>
    </div>
  );
};

const Perfil = () => {
  const usuarioInicial = {
    nombre: "Juan Pérez",
    correo: "ejemplo@alumnos.uai.cl",
    rol: "Estudiante",
    carrera: "Ingeniería en Ingeniería",
    generacion: "2022",
    foto: "https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg",
    descripcion: "Estudiante de Ingeniería en Ingeniería en su último año.",
    certificaciones: [
      { id: 1, titulo: "Certificación en Data Science", fecha: "Mayo 2023" },
      {
        id: 2,
        titulo: "Certificación en Machine Learning",
        fecha: "Junio 2023",
      },
      { id: 3, titulo: "Certificación en Desarrollo Web", fecha: "Julio 2023" },
    ],
  };

  const [usuario, setUsuario] = useState(usuarioInicial);
  const [editando, setEditando] = useState(false);
  const [nuevaDescripcion, setNuevaDescripcion] = useState(usuario.descripcion);
  const [showPopup, setShowPopup] = useState(false);

  const manejarCambioDescripcion = (e) => {
    setNuevaDescripcion(e.target.value);
  };

  const guardarDescripcion = () => {
    setUsuario({ ...usuario, descripcion: nuevaDescripcion });
    setEditando(false);
  };

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
          <p className="text-text">{usuario.carrera}</p>
          <p className="text-text">Generación {usuario.generacion}</p>
          <p className="text-text font-semibold">{usuario.rol}</p>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-2xl font-semibold text-text">Descripción</h3>
        {editando ? (
          <div>
            <textarea
              className="mt-2 p-2 w-full border rounded-md"
              value={nuevaDescripcion}
              onChange={manejarCambioDescripcion}
            />
            <button
              className="mt-2 px-4 py-2 bg-accent text-text2 rounded-md"
              onClick={guardarDescripcion}
            >
              Guardar
            </button>
            <button
              className="mt-2 ml-2 px-4 py-2 bg-primary/40 text-text2 rounded-md"
              onClick={() => setEditando(false)}
            >
              Cancelar
            </button>
          </div>
        ) : (
          <div>
            <p className="mt-2 text-text">{usuario.descripcion}</p>
            <button
              className="mt-2 px-4 py-2 bg-accent text-text2 rounded-md"
              onClick={() => setEditando(true)}
            >
              Editar
            </button>
          </div>
        )}
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
