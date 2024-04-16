import Section from "./Section";
import React from "react";

const Footer = () => {
  return (
    <Section crosses className="!px-0 !py-10">
      <div className=" container bottom-0 flex sm:justify-between justify-center items-center gap-10 max-sm:flex-col w-full">
        <p className="caption text-n-4 lg:block">
          © {new Date().getFullYear()}. Grupo RAS UAI. Todos los derechos
          reservados.
        </p>
      </div>
    </Section>
  );
};

export default Footer;
