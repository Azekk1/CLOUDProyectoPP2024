import Section from "./Section";
import React from "react";
import { useTranslation } from 'react-i18next';
import '../Multilenguaje/i18n';

const Footer = () => {
  const { t } = useTranslation('footer');

  return (
    <Section crosses className="!px-0 !py-10">
      <div className=" container bottom-0 flex sm:justify-between justify-center items-center gap-10 max-sm:flex-col w-full">
        <p className="caption text-n-4 lg:block">
          © {new Date().getFullYear()}. {t('rights')}
        </p>
      </div>
    </Section>
  );
};

export default Footer;
