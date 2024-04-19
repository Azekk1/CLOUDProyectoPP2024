import Section from "./Section";
import { useTranslation } from 'react-i18next';
import '../Multilenguaje/i18n';

const Dashboard = () => {
  const { t } = useTranslation('dashboard');

  return (
    <Section
      className="pt-[12rem] -mt-[5.25] md:-mt-0 bg-slate-100" // Ajuste del margen superior en dispositivos medianos y grandes
      crosses
      crossesOffset="lg:translate-y-[5.25rem]"
      customPaddings
      id="dashboard"
    >
      <div className="container relative w-full">
        <h1 className="h1 mb-6 mt-6 text-white relative z-10 inline-block">
          {t('dashboard')}
        </h1>
      </div>
    </Section>
  );
};

export default Dashboard;
