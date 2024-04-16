import Section from "./Section";
import imgcert from "../otros/imgcert.svg";
import fondo from "../otros/fondo2.jpg";
import ingenieriac from "../otros/ingenieriac.jpg";
import comercial from "../otros/ingcomercial.jpg";
import derecho from "../otros/derecho.jpg";
import periodismo from "../otros/periodismo.png";
import psico from "../otros/psicologia.jpg";

const Card = ({ imageSrc, text }) => {
  return (
    <div
      className="relative z-1 p-0.5 rounded-2xl bg-gray-200 border-4 border-sky-300 hover:filter hover:brightness-75 transition duration-300 w-700 h-700"
      style={{ width: "250px", height: "250px" }}
    >
      <img
        src={imageSrc}
        alt="Fondo"
        className="absolute inset-0 w-full h-full object-cover object-center filter blur-sm"
        style={{ zIndex: "-1" }}
      />

      <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center text-white z-10">
        <div className="bg-black bg-opacity-50 p-4 rounded-md">
          <p className="text-white">{text}</p>
        </div>
      </div>
    </div>
  );
};

const Hero = () => {
  return (
    <Section
      className="pt-[12rem] -mt-[5.25] md:-mt-0" // Ajuste del margen superior en dispositivos medianos y grandes
      crosses
      crossesOffset="lg:translate-y-[5.25rem]"
      customPaddings
      id="home"
    >
      <div className="container relative w-full">
        {" "}
        <div className="relative z-1 w-full mx-auto text-center mb-[4rem] md:mb-20 lg:mb-[6rem]">
          <div
            className="relative flex items-center justify-center text-center w-full"
            style={{ height: "250px", width: "100%" }}
          >
            <img
              src={fondo}
              alt="Fondo"
              className="absolute inset-0 w-screen h-full object-cover filter blur-sm"
              style={{ zIndex: "-1" }}
            />
            <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
            <h1 className="h1 mb-6 mt-6 text-white relative z-10 inline-block">
              Bienvenido a Certificados UAI
            </h1>
          </div>
          <p className="body-1 max-w-3xl mx-auto mb-6 text-n-2 lg:mb-8 font-bold text-2xl mt-10">
            En este sitio web podrás encontrar todo lo relacionado a
            certificaciones para tu carrera
          </p>
          <p>¿Por qué certificarse?</p>
          <p>
            Las certificaciones te entregan herramientas útiles para
            desarrollarte profesionalmente, además fortalecen tu curriculum y te
            permiten especializarte adquiriendo conocimientos en áreas de tu
            gusto.
          </p>
          <p className="body-1 max-w-xl mx-auto mb-6 text-n-2 lg:mb-8 font-bold text-4xl mt-6 text-center">
            Selecciona tu área de interés
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 -mt-10">
          <Card imageSrc={ingenieriac} text="Ingeniería Civil" />
          <Card imageSrc={comercial} text="Ingeniería Comercial" />
          <Card imageSrc={derecho} text="Derecho" />
          <Card imageSrc={psico} text="Psicología" />
          <Card imageSrc={periodismo} text="Periodismo" />
        </div>
      </div>
    </Section>
  );
};

export default Hero;
