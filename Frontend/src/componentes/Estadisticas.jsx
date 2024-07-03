import React, { useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import "../Multilenguaje/i18n";

const formatNumber = (num) => {
  const parsedNum = parseFloat(num);
  return Number.isInteger(parsedNum)
    ? parsedNum.toFixed(0)
    : parsedNum.toFixed(2);
};

const Estadisticas = () => {
  const { t, i18n } = useTranslation("stats");
  const stats =
    "items-center justify-center flex bg-background rounded-lg border border-accent text-text";

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

  const [openTable, setOpenTable] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [avgYear, setAvgYear] = useState([]);
  const [avgCareer, setAvgCareer] = useState([]);
  const [careers, setCareers] = useState([]);

  const callDebugLog = (json) => {
    if (json.length == 0) {
      axios
        .get("http://139.59.134.160:5000/debug")
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          callErrorLog();
        });
    }
  };

  const callErrorLog = () => {
    axios.get("http://139.59.134.160:5000/error").then((response) => {
      console.log(response.data);
    });
  };

  const callInfoLog = (tabla) => {
    axios.get("http://139.59.134.160:5000/info").then((response) => {
      console.log(response.data, tabla);
    });
  };

  const fetchData = async (endpoint, setter) => {
    const response = await fetch(`http://139.59.134.160:5000/api/${endpoint}`);
    const data = await response.json();
    setter(data);
    callDebugLog(data);
  };

  const handleToggleTable = async (table) => {
    if (openTable === table) {
      setOpenTable(null);
    } else {
      setOpenTable(table);
      let endpoint = "";
      let setter = null;
      switch (table) {
        case "certificates":
          endpoint = "top10";
          setter = setCertificates;
          break;
        case "avgYear":
          endpoint = "avgYear";
          setter = setAvgYear;
          break;
        case "avgCareer":
          endpoint = "avgCareer";
          setter = setAvgCareer;
          break;
        case "careers":
          endpoint = "careers";
          setter = setCareers;
          break;
        default:
          break;
      }
      await fetchData(endpoint, setter);
      callInfoLog(endpoint);
    }
  };

  const tableConfigs = {
    certificates: {
      columns: [
        { header: t("certificate_name"), key: "name" },
        { header: t("students"), key: "numero_de_usuarios" },
      ],
    },
    avgYear: {
      columns: [
        { header: t("entry_year"), key: "entry_year" },
        {
          header: t("average_students"),
          key: "promedio_certificados",
        },
      ],
    },
    avgCareer: {
      columns: [
        { header: t("career"), key: "name" },
        {
          header: t("average_students"),
          key: "promedio_certificados",
        },
      ],
    },
    careers: {
      columns: [
        { header: t("career"), key: "career_name" },
        { header: t("certificate_name"), key: "certificate_name" },
      ],
    },
  };
  return (
    <div className="ml-12 grid grid-cols-2 gap-2 bg-secondary rounded-lg p-1 w-11/12 h-11/12">
      <div className="items-center justify-center flex bg-slate-700 rounded-lg border border-slate-800 col-span-2 h-16">
        {t("stats")}
      </div>
      <div
        className={`items-center justify-center flex bg-slate-700 rounded-lg border border-slate-800 h-40 transition hover:bg-slate-800 overflow-y-auto ${
          openTable === "certificates" ? "text-white" : ""
        }`}
        onClick={() => handleToggleTable("certificates")}
      >
        {openTable === "certificates" ? t("close") : t("top10")}
      </div>
      <div
        className={`items-center justify-center flex bg-slate-700 rounded-lg border border-slate-800 h-40 transition hover:bg-slate-800 ${
          openTable === "avgYear" ? "text-white" : ""
        }`}
        onClick={() => handleToggleTable("avgYear")}
      >
        {openTable === "avgYear" ? t("close") : t("year")}
      </div>
      <div
        className={`items-center justify-center flex bg-slate-700 rounded-lg border border-slate-800 h-40 transition hover:bg-slate-800 ${
          openTable === "avgCareer" ? "text-white" : ""
        }`}
        onClick={() => handleToggleTable("avgCareer")}
      >
        {openTable === "avgCareer" ? t("close") : t("average_career")}
      </div>
      <div
        className={`items-center justify-center flex bg-slate-700 rounded-lg border border-slate-800 h-40 transition hover:bg-slate-800 ${
          openTable === "careers" ? "text-white" : ""
        }`}
        onClick={() => handleToggleTable("careers")}
      >
        {openTable === "careers" ? t("close") : t("career_common")}
      </div>

      {openTable && (
        <div
          className="col-span-2 p-4 overflow-y-auto"
          style={{ maxHeight: "60vh" }}
        >
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-lg mb-4"
            onClick={() => setOpenTable(null)}
          >
            {t("close table")}
          </button>
          <table className="w-full bg-white rounded-lg overflow-y-auto">
            <thead className="bg-slate-700 text-white">
              <tr>
                {tableConfigs[openTable].columns.map((col) => (
                  <th key={col.key} className="px-4 py-2">
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {openTable === "certificates" &&
                certificates.map((item, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-gray-100" : ""}
                  >
                    <td className="border px-4 py-2 bg-slate-600">
                      {item.name}
                    </td>
                    <td className="border px-4 py-2 bg-slate-600">
                      {formatNumber(item.numero_de_usuarios)}
                    </td>
                  </tr>
                ))}
              {openTable === "avgYear" &&
                avgYear.map((item, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-gray-100" : ""}
                  >
                    <td className="border px-4 py-2 bg-slate-600">
                      {item.entry_year}
                    </td>
                    <td className="border px-4 py-2 bg-slate-600">
                      {formatNumber(item.promedio_certificados)}
                    </td>
                  </tr>
                ))}
              {openTable === "avgCareer" &&
                avgCareer.map((item, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-gray-100" : ""}
                  >
                    <td className="border px-4 py-2 bg-slate-600">
                      {carreraTranslations[i18n.language][item.name]}
                    </td>
                    <td className="border px-4 py-2 bg-slate-600">
                      {formatNumber(item.promedio_certificados)}
                    </td>
                  </tr>
                ))}
              {openTable === "careers" &&
                careers.map((item, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-gray-100" : ""}
                  >
                    <td className="border px-4 py-2 bg-slate-600">
                      {carreraTranslations[i18n.language][item.career_name]}
                    </td>
                    <td className="border px-4 py-2 bg-slate-600">
                      {item.certificate_name}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Estadisticas;
