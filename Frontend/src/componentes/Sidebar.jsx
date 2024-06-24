import React, { useState, createContext, useContext } from "react";

const SidebarContext = createContext();

const Sidebar = ({ children }) => {
  const [deployed, setDeployed] = useState(false);

  return (
    <aside
      className={`h-dvh bg-background shadow-xl border-r-2 border-secondary sticky transition-all duration-500 min-h-screen z-0 ${
        deployed ? "w-64" : "w-18"
      }`}
    >
      <nav className="h-full flex flex-col">
        <div
          className={`absolute top-0 right-0 mt-5 ${
            deployed ? "-mr-4" : "-mr-4"
          } transition-all duration-500`}
        >
          <button
            onClick={() => setDeployed((curr) => !curr)}
            className="p-2 rounded-full transition-colors duration-500 bg-secondary hover:bg-accent"
          >
            <img
              src="https://cdn-icons-png.freepik.com/512/142/142054.png"
              width={14}
              height={14}
              alt="Toggle"
            />
          </button>
        </div>
        <div className="border-b-2 border-secondary flex items-center p-3 transition-all duration-500">
          <img
            src="https://pbs.twimg.com/profile_images/1580609621605203968/zx_WDfIT_400x400.jpg"
            className="h-11 w-11 rounded-full transition-all duration-500"
            alt="Logo UAI"
          />
          <div
            className={`flex justify-between items-center overflow-hidden transition-all duration-500 ml-3 ${
              deployed ? "w-64" : "w-0"
            }`}
          >
            <div className="leading-4 transition-all duration-500">
              <h2 className="font-semibold text-xl text-text">Dashboard</h2>
            </div>
          </div>
        </div>
        <SidebarContext.Provider value={{ deployed }}>
          <ul className="flex-grow px-3 transition-all duration-500">
            {children}
          </ul>
        </SidebarContext.Provider>
        <div className="flex-1 items-center bg-primary p-3 mt-80"></div>
      </nav>
    </aside>
  );
};

export default Sidebar;

export function SidebarItems({ icon, text, active }) {
  const { deployed } = useContext(SidebarContext);
  return (
    <li
      className={`relative flex items-center px-2 py-2 my-1 font-medium rounded-md cursor-pointer border-b-2 group transition-all duration-500 ${
        active ? "text-text" : "hover:bg-accent/50 text-text"
      }`}
      style={{ minWidth: deployed ? "auto" : "3.5rem" }}
    >
      <img src={icon} className="h-6 w-6 transition-all duration-500" />
      <span
        className={`absolute left-10 text-text mt-2 font-semibold overflow-hidden transition-all duration-500 ${
          deployed ? "opacity-100" : "opacity-0"
        }`}
      >
        {text}
      </span>
      {!deployed && (
        <div
          className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-accent/90 text-text text-sm invisible opacity-20 -translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 duration-500`}
        >
          {text}
        </div>
      )}
    </li>
  );
}
