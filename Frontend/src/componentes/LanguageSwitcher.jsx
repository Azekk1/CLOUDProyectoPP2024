import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "../Multilenguaje/i18n";
import en from "../otros/ingles.png";
import es from "../otros/espanol.png";

const LanguageSwitcher = () => {
  const { t } = useTranslation("language");

  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex flex-row ml-64 space-x-4">
      <button onClick={() => changeLanguage("en")}>
        <img src={en} style={{ width: "20px", height: "20px" }} />
      </button>
      <button onClick={() => changeLanguage("es")}>
        <img src={es} style={{ width: "20px", height: "20px" }} />
      </button>
    </div>
  );
};

export default LanguageSwitcher;
