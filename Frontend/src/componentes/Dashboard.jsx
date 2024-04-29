import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "../Multilenguaje/i18n";

const uploadCertificate = async (certificateFile, userData) => {
  const formData = new FormData();
  formData.append('file', certificateFile);
  formData.append('user_id', JSON.stringify(userData)); // Agregar userData al FormData

  try {
    const response = await fetch('http://localhost:3000/dashboard', {
      method: 'POST',
      body: formData,
      // Puedes agregar headers si es necesario, como 'Content-Type': 'multipart/form-data',
    });

    if (!response.ok) {
      // Manejar errores de la respuesta aquí
      const errorData = await response.json();
      throw new Error(errorData.error);
    }

    const responseData = await response.json();
    return responseData.certificate_id;
  } catch (error) {
    // Manejar errores de la solicitud aquí
    console.error('Error al subir el certificado:', error.message);
    throw error;
  }
};

const Popup = ({ show, onClose, certificateName, onFileSelect, onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUploadClick = async () => {
    try {
      if (selectedFile) {
        onFileSelect(selectedFile);
        await onUpload(); // Llama a la función onUpload pasada como prop
        onClose();
      }
    } catch (error) {
      console.error('Error al subir el certificado:', error);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-black">
          Sube tu certificado {certificateName}
        </h2>
        <input
          type="file"
          className="mb-4"
          onChange={handleFileChange}
        />
        <div className="flex justify-end">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            onClick={onClose}
          >
            Cerrar
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded"
            onClick={handleUploadClick} // Llama a handleUploadClick en lugar de handleUpload
          >
            Subir
          </button>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { t } = useTranslation("dashboard");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const togglePopup = (certificateName) => {
    setShowPopup(!showPopup);
    setSelectedCertificate(certificateName);
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    try {
      const certificateId = await uploadCertificate(selectedFile, userData); // Pasar userData como parámetro adicional
      console.log('Certificado subido exitosamente. ID:', certificateId);
      // Aquí puedes realizar acciones adicionales después de subir el certificado, como cerrar el popup o actualizar la interfaz de usuario.
    } catch (error) {
      // Manejar errores
      console.error('Error al subir el certificado:', error);
      // Aquí puedes mostrar un mensaje de error al usuario, por ejemplo.
    }
  };

  return (
<<<<<<< HEAD
    <div>
      <h1 className="h1 mb-6 mt-6 items-center text-white relative text-center z-10 text-5xl">
        {t("dashboard")}
      </h1>
      <div>
        <span className="text-xl font-bold">
          {" "}
          Sube una certificación de la lista:
        </span>
        <ul className="mt-6 space-y-4 border-2 p-2 text-center bg-slate-50 text-white w-64 rounded-lg">
          <li
            className="cursor-pointer border bg-slate-700 p-2 rounded-lg"
            onClick={() => togglePopup("Certificación 1")}
          >
            Certificación 1
          </li>
          <li
            className="cursor-pointer border bg-slate-700 p-2 rounded-lg"
            onClick={() => togglePopup("Certificación 2")}
          >
            Certificación 2
          </li>
          <li
            className="cursor-pointer border bg-slate-700 p-2 rounded-lg"
            onClick={() => togglePopup("Certificación 3")}
          >
            Certificación 3
          </li>
        </ul>
=======
    <Section
      className="pt-[12rem] -mt-[5.25] md:-mt-0 bg-slate-100"
      crosses
      crossesOffset="lg:translate-y-[5.25rem]"
      customPaddings
      id="dashboard"
    >
      <div className="container relative w-full">
        <h1 className="h1 mb-6 mt-6 items-center text-white relative text-center z-10 text-5xl">
          {t("dashboard")}
        </h1>
        <div>
          <span className="text-xl font-bold">
            {" "}
            Sube una certificación de la lista:
          </span>
          <ul className="mt-6 space-y-4 border-2 p-2 text-center bg-slate-50 text-white w-64 rounded-lg">
            <li
              className="cursor-pointer border bg-slate-700 p-2 rounded-lg hover:opacity-80"
              onClick={() => togglePopup("Certificación 1")}
            >
              Certificación 1
            </li>
            <li
              className="cursor-pointer border bg-slate-700 p-2 rounded-lg hover:opacity-80"
              onClick={() => togglePopup("Certificación 2")}
            >
              Certificación 2
            </li>
            <li
              className="cursor-pointer border bg-slate-700 p-2 rounded-lg hover:opacity-80"
              onClick={() => togglePopup("Certificación 3")}
            >
              Certificación 3
            </li>
          </ul>
        </div>
        <Popup
          show={showPopup}
          onClose={togglePopup}
          certificateName={selectedCertificate}
        />
>>>>>>> abf25f7274598e25e73249baf8c0ea373a456863
      </div>
      <Popup
        show={showPopup}
        onClose={() => setShowPopup(false)}
        certificateName={selectedCertificate}
        onFileSelect={handleFileSelect}
        onUpload={handleUpload} // Aquí se pasa la función handleUpload como una prop llamada onUpload
      />
    </div>
  );
};

export default Dashboard;
