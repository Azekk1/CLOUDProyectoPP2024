import Section from "./Section";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "../Multilenguaje/i18n";

const Popup = ({ show, onClose, certificateName }) => {
  const { t } = useTranslation("dashboard");
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-black">
          {t('submit')} {certificateName}
        </h2>
        <label htmlFor="fileInput" className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg mr-4">{t('file')}</label>
              <input type="file" id="fileInput" className="mb-4"  style={{ visibility: 'hidden' }}/>
        <div className="flex justify-end">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            onClick={onClose}
          >
            {t('close')}
          </button>
          <button className="bg-green-500 text-white px-4 py-2 rounded">
            {t('submit2')}
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
      <div className="container relative w-full">
        <h1 className="h1 mb-6 mt-6 items-center text-white relative text-center z-10 text-5xl">
          {t("dashboard")}
        </h1>
        <div>
          <span className="text-xl font-bold">
            {" "}
            {t('list')}
          </span>
          <ul className="mt-6 space-y-4 border-2 p-2 text-center bg-slate-50 text-white w-64 rounded-lg">
            <li
              className="cursor-pointer border bg-slate-700 p-2 rounded-lg"
              onClick={() => togglePopup(t('1'))}
            >
              {t('1')}
            </li>
            <li
              className="cursor-pointer border bg-slate-700 p-2 rounded-lg"
              onClick={() => togglePopup(t('2'))}
            >
              {t('2')}
            </li>
            <li
              className="cursor-pointer border bg-slate-700 p-2 rounded-lg"
              onClick={() => togglePopup(t('3'))}
            >
              {t('3')}
            </li>
          </ul>
        </div>
        <Popup
          show={showPopup}
          onClose={togglePopup}
          certificateName={selectedCertificate}
        />
      </div>
    </Section>
  );
};

export default Dashboard;
