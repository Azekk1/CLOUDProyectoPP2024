const Estadisticas = () => {
  const stats =
    "items-center justify-center flex bg-slate-700 rounded-lg border border-slate-800";
  return (
    <div className="grid grid-cols-2 -mt-2 gap-2 bg-slate-600 rounded-lg p-1">
      <div className={`${stats} col-span-2 h-16`}>Info</div>
      <div className={`${stats} h-40 `}>Estadística 1</div>
      <div className={`${stats} h-40`}>Estadística 2</div>
      <div className={`${stats} h-40`}>Estadística 3</div>
      <div className={`${stats} h-40`}>Estadística 4</div>
    </div>
  );
};

export default Estadisticas;
