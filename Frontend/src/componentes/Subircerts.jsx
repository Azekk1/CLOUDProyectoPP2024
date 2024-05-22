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
        {selectedFile && <p className="text-gray-700">{selectedFile.name}</p>}
        <div className="flex justify-end">
          <button
            className="transition-colors bg-accent hover:bg-accent/70 text-white px-4 py-2 rounded mr-2"
            onClick={onClose}
          >
            {t("close")}
          </button>
          <button className="transition-colors bg-primary/80 hover:bg-primary/50 text-white px-4 py-2 rounded">
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
      className="pt-[12rem] -mt-[5.25] md:-mt-0"
      crosses
      crossesOffset="lg:translate-y-[5.25rem]"
      customPaddings
      id="dashboard"
    >
      <div className="container mx-auto relative w-full mb-36 px-6">
        <h1 className="h1 mb-6 mt-6 items-center text-text relative text-center z-10 text-5xl">
          {t("dashboard")}
        </h1>
        <div className="mr-8 mb-6">
          <div className="relative">
            <button
              className="transition-colors bg-primary hover:bg-primary/80 text-text2 font-bold py-2 px-2 rounded-lg text-wrap text-xs w-24 h-16"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {t("upload_cert")}
            </button>
            {menuOpen && (
              <ul className="absolute mt-2 w-64 rounded-lg text-text2">
                <li
                  className="cursor-pointer border-2 border-secondary bg-primary p-2 rounded-lg"
                  onClick={() => {
                    togglePopup(t("1"));
                    setMenuOpen(false);
                  }}
                >
                  {t("1")}
                </li>
                <li
                  className="cursor-pointer border-2 border-secondary bg-primary p-2 rounded-lg"
                  onClick={() => {
                    togglePopup(t("2"));
                    setMenuOpen(false);
                  }}
                >
                  {t("2")}
                </li>
                <li
                  className="cursor-pointer border-2 border-secondary bg-primary p-2 rounded-lg"
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
