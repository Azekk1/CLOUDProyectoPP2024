import Section from "./Section";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "../Multilenguaje/i18n";
import TablaDashboard from "./TablaDashboard";
import Estadisticas from "./Estadisticas";

const Popup = ({ show, onClose, certificateName }) => {
  const { t } = useTranslation("dashboard");
  const [selectedFile, setSelectedFile] = useState(null);

  if (!show) return null;

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-black">
          {t("submit")} {certificateName}
        </h2>
        <label
          htmlFor="fileInput"
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg mr-4"
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
        {selectedFile && <p className="text-gray-700">{selectedFile.name}</p>}
        <div className="flex justify-end">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            onClick={onClose}
          >
            {t("close")}
          </button>
          <button className="bg-green-500 text-white px-4 py-2 rounded">
            {t("submit2")}
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
  const [menuOpen, setMenuOpen] = useState(false);

  const togglePopup = (certificateName) => {
    setShowPopup(!showPopup);
    setSelectedCertificate(certificateName);
  };

  return (
    <Section
      className="pt-[12rem] -mt-[5.25] md:-mt-0 bg-slate-100"
      crosses
      crossesOffset="lg:translate-y-[5.25rem]"
      customPaddings
      id="dashboard"
    >
      <div className="container relative w-full mb-36">
        <h1 className="h1 mb-6 mt-6 items-center text-white relative text-center z-10 text-5xl">
          {t("dashboard")}
        </h1>
        <div className="mr-8">
          <div className="relative -ml-16">
            <button
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-2 rounded-lg text-wrap text-xs w-24 h-16"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {t("upload_cert")}
            </button>
            {menuOpen && (
              <ul className="absolute mt-2 w-64 rounded-lg bg-slate-50 border-2 border-slate-700 text-white">
                <li
                  className="cursor-pointer border bg-slate-700 p-2 rounded-lg"
                  onClick={() => {
                    togglePopup(t("1"));
                    setMenuOpen(false);
                  }}
                >
                  {t("1")}
                </li>
                <li
                  className="cursor-pointer border bg-slate-700 p-2 rounded-lg"
                  onClick={() => {
                    togglePopup(t("2"));
                    setMenuOpen(false);
                  }}
                >
                  {t("2")}
                </li>
                <li
                  className="cursor-pointer border bg-slate-700 p-2 rounded-lg"
                  onClick={() => {
                    togglePopup(t("3"));
                    setMenuOpen(false);
                  }}
                >
                  {t("3")}
                </li>
              </ul>
            )}
          </div>
        </div>
        <div className="flex items-center">
          <div className="flex-grow">
            {/*Tabla con usuarios de prueba*/}
            <TablaDashboard />
            {/* Estadísticas del usuario */}
            <div className="text-center text-white my-6">
              <h2 className="text-3xl font-bold">{t("stats")}</h2>
            </div>
            <Estadisticas />
          </div>
        </div>
        <Popup
          show={showPopup}
          onClose={() => {
            setShowPopup(false);
            setMenuOpen(false);
          }}
          certificateName={selectedCertificate}
        />
      </div>
    </Section>
  );
};

export default Dashboard;
