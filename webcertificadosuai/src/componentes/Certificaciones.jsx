import Section from "./Section";

const Certificaciones = () => {
  return (
    <Section
      className="pt-[12rem] -mt-[5.25] md:-mt-0" // Ajuste del margen superior en dispositivos medianos y grandes
      crosses
      crossesOffset="lg:translate-y-[5.25rem]"
      customPaddings
      id="certificaciones"
    >
      <div className="container relative w-full text-center">
        <h1 className="h1 mb-6 mt-6 text-white relative z-10 inline-block text-5xl">
          Busca las certificaciones de tu interés
        </h1>
      </div>
    </Section>
  );
};

export default Certificaciones;
