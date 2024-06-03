import React, { useState } from "react";
import axios from 'axios';

const formatNumber = (num) => {
  const parsedNum = parseFloat(num);
  return Number.isInteger(parsedNum)
    ? parsedNum.toFixed(0)
    : parsedNum.toFixed(2);
};

const Estadisticas = () => {
  const stats =
    "items-center justify-center flex bg-background rounded-lg border border-accent text-text";
  const [openTable, setOpenTable] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [avgYear, setAvgYear] = useState([]);
  const [avgCareer, setAvgCareer] = useState([]);
  const [careers, setCareers] = useState([]);

  const callDebugLog = (json) => {
    if (json.length == 0) {
      axios.get('http://localhost:4000/debug')
        .then(response => {
          console.log(response.data);
        })
        .catch(error => {
          callErrorLog();
        });
    }
  };

  const callErrorLog = () => {
    axios.get('http://localhost:4000/error')
      .then(response => {
        console.log(response.data);
      })
  };

  const callInfoLog = (tabla) => {
    axios.get('http://localhost:4000/info')
    .then(response => {
      console.log(response.data, tabla);
    })
  }


  const fetchData = async (endpoint, setter) => {
    const response = await fetch(`http://localhost:4000/api/${endpoint}`);
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
        { header: "Nombre del certificado", key: "name" },
        { header: "Número de usuarios", key: "numero_de_usuarios" },
      ],
    },
    avgYear: {
      columns: [
        { header: "Año de ingreso", key: "entry_year" },
        {
          header: "Promedio certificados por alumno",
          key: "promedio_certificados",
        },
      ],
    },
    avgCareer: {
      columns: [
        { header: "Carrera", key: "name" },
        {
          header: "Promedio certificados por alumno",
          key: "promedio_certificados",
        },
      ],
    },
    careers: {
      columns: [
        { header: "Carrera", key: "career_name" },
        { header: "Nombre certificado", key: "certificate_name" },
      ],
    },
  };
  return (
    <div className="grid grid-cols-2 gap-2 bg-secondary rounded-lg p-1 w-full h-11/12">
      <div className="items-center justify-center flex bg-slate-700 rounded-lg border border-slate-800 col-span-2 h-16">
        Info
      </div>
      <div
        className={`items-center justify-center flex bg-slate-700 rounded-lg border border-slate-800 h-40 transition hover:bg-slate-800 ${
          openTable === "certificates" ? "text-white" : ""
        }`}
        onClick={() => handleToggleTable("certificates")}
      >
        {openTable === "certificates"
          ? "Cerrar"
          : "Top 10 certificados más comunes"}
      </div>
      <div
        className={`items-center justify-center flex bg-slate-700 rounded-lg border border-slate-800 h-40 transition hover:bg-slate-800 ${
          openTable === "avgYear" ? "text-white" : ""
        }`}
        onClick={() => handleToggleTable("avgYear")}
      >
        {openTable === "avgYear"
          ? "Cerrar"
          : "Promedio de certificados por año de ingreso"}
      </div>
      <div
        className={`items-center justify-center flex bg-slate-700 rounded-lg border border-slate-800 h-40 transition hover:bg-slate-800 ${
          openTable === "avgCareer" ? "text-white" : ""
        }`}
        onClick={() => handleToggleTable("avgCareer")}
      >
        {openTable === "avgCareer"
          ? "Cerrar"
          : "Promedio de certificados por carrera"}
      </div>
      <div
        className={`items-center justify-center flex bg-slate-700 rounded-lg border border-slate-800 h-40 transition hover:bg-slate-800 ${
          openTable === "careers" ? "text-white" : ""
        }`}
        onClick={() => handleToggleTable("careers")}
      >
        {openTable === "careers"
          ? "Cerrar"
          : "Certificados más comunes por carrera"}
      </div>

      {openTable && (
        <div className="col-span-2 p-4">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-lg mb-4"
            onClick={() => setOpenTable(null)}
          >
            Cerrar tabla
          </button>
          <table className="w-full bg-white rounded-lg overflow-hidden">
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
                      {item.name}
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
                      {item.career_name}
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
