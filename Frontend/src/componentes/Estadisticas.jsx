const Estadisticas = () => {
  const stats =
    "items-center justify-center flex bg-background rounded-lg border border-accent text-text";
  return (
    <div className="grid grid-cols-2 gap-2 bg-secondary rounded-lg p-1 w-full h-11/12">
      <div className={`${stats} col-span-2 h-16`}>Info</div>
      <div className={`${stats} h-40`}>Estadística 1</div>
      <div className={`${stats} h-40`}>Estadística 2</div>
      <div className={`${stats} h-40`}>Estadística 3</div>
      <div className={`${stats} h-40`}>Estadística 4</div>
    </div>
  );
};

export default Estadisticas;
