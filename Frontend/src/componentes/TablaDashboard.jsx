import { data } from "../assets/nombres_prueba";
import icono from "../otros/menu.png";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { useState } from "react";
import Estadisticas from "./Estadisticas";

const TablaDashboard = () => {
  const columns = [
    {
      header: "ID",
      accessorKey: "id",
    },
    {
      header: "Nombres",
      accessorKey: "Nombres",
    },
    {
      header: "Apellidos",
      accessorKey: "Apellidos",
    },
    {
      header: "Correo",
      accessorKey: "email",
    },
    {
      header: "Carrera",
      accessorKey: "Carrera",
    },
    {
      header: "Generación",
      accessorKey: "Generación",
    },
    {
      header: "Acciones",
      cell: (row) => (
        <button
          onClick={() => {
            Estadisticas;
          }}
        >
          <img src={icono} width={24} height={24} />
        </button>
      ),
    },
  ];

  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter: filtering,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
  });

  return (
    <div className="bg-secondary p-2 rounded-lg w-[97%]">
      <input
        type="text"
        value={filtering}
        onChange={(e) => setFiltering(e.target.value)}
        className="border w-64 border-secondary mt-6 -mb-1 rounded-md"
        placeholder="Filtra por lo que necesites"
      />
      <table className="w-full bg-primary rounded-lg ">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  className="p-2"
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  {{ asc: "▲", desc: "▼" }[header.column.getIsSorted() ?? null]}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              className="border-t border-secondary  bg-background text-center transition hover:bg-background/80 text-text"
              key={row.id}
            >
              {row.getVisibleCells().map((cell) => (
                <td className="p-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button
        className="p-1 bg-accent mt-2 rounded-xl mx-1 text-text2"
        onClick={() => table.setPageIndex(0)}
      >
        Primera página
      </button>
      <button
        className="p-1 bg-accent mt-2 rounded-xl mx-1 text-text2"
        onClick={() => table.previousPage()}
      >
        Página Anterior
      </button>
      <button
        className="p-1 bg-accent mt-2 rounded-xl mx-1 text-text2"
        onClick={() => table.nextPage()}
      >
        Página Siguiente
      </button>
      <button
        className="p-1 bg-accent mt-2 rounded-xl mx-1 text-text2"
        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
      >
        Última página
      </button>
    </div>
  );
};

export default TablaDashboard;
