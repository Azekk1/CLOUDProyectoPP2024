import Button from "./componentes/Button";
import Header from "./componentes/Header";
import Home from "./componentes/Home";
import Footer from "./componentes/Footer";
import Dashboard from "./componentes/Dashboard";
import { Route, Routes } from "react-router-dom";
import Certificaciones from "./componentes/Certificaciones";
import Login from "./componentes/Login";
import campus from "./otros/UAICAMPUS.jpg";

const App = () => {
  return (
    <>
      <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden w-screen">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/certificaciones" element={<Certificaciones />} />
        </Routes>
        <Footer />
      </div>
    </>
  );
};

export default App;
