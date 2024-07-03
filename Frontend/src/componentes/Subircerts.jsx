import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const Subircerts = ({ onClose, certificateName }) => {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert("Por favor, selecciona un archivo primero.");
      return;
    }

    const formData = new FormData();
    formData.append("user_id", userId); // Asegúrate de tener un userId válido
    formData.append("certificate_name", certificateName); // Ya estás recibiendo certificateName como prop
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://127.0.0.1:5000/dashboard", {
        method: "POST",
        body: formData,
        // Asegúrate de incluir headers si tu API los requiere
      });

      if (!response.ok) {
        throw new Error("Error al subir el archivo");
      }

      const result = await response.json();
      console.log(result);
      onClose(); // Cierra el modal o limpia el formulario aquí
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      alert("Error al subir el archivo. Por favor, intenta de nuevo.");
    }
  };

  // Ajustes al renderizado y adición de alerta para cuando no hay archivo seleccionado

  // Asumiendo que la función handleFileChange y otras partes relevantes del componente ya están definidas
  // y que este fragmento de código se encuentra dentro de un componente funcional de React.

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-primary bg-opacity-50 z-50">
      <div className="bg-background p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-text">
          {t("submit")} {certificateName}
        </h2>
        <label
          htmlFor="fileInput"
          className="transition-all bg-gray-500 cursor-pointer hover:bg-secondary text-white font-bold py-2 px-4 rounded-xl mr-4"
        >
          {t("file")}
        </label>
        <input
          type="file"
          id="fileInput"
          className="mb-4"
          style={{ visibility: "hidden" }}
          onChange={handleFileChange}
        />
        {selectedFile ? (
          <p className="text-gray-700">{selectedFile.name}</p>
        ) : (
          // Alerta cuando no hay archivo seleccionado
          <p className="text-red-500">No se ha seleccionado ningún archivo.</p>
        )}
        <div className="flex justify-end">
          <button
            onClick={() => {
              if (!selectedFile) {
                // Muestra una alerta si no hay archivo seleccionado
                alert("Por favor, selecciona un archivo antes de continuar.");
                return;
              }
              handleSubmit(); // Llama a la función handleSubmit aquí
            }}
            className="transition-all bg-primary cursor-pointer hover:bg-secondary text-white font-bold py-2 px-4 rounded-xl"
          >
            {t("upload")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Subircerts;
