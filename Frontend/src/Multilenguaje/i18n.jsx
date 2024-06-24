import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Importa tus archivos de traducción
import homeEN from './en/home.json';
import homeES from './es/home.json';
import certificationsEN from './en/certifications.json'
import certificationsES from './es/certifications.json'
import dashboardEN from './en/dashboard.json'
import dashboardES from './es/dashboard.json'
import footerEN from './en/footer.json'
import footerES from './es/footer.json'
import headerEN from './en/header.json'
import headerES from './es/header.json'
import languageEN from './en/language.json'
import languageES from './es/language.json'
import loginEN from './en/login.json'
import loginES from './es/login.json'
import logoutEN from './en/logout.json'
import logoutES from './es/logout.json'
import statsEN from './en/stats.json'
import statsES from './es/stats.json'

// Configura i18next
i18n
  .use(initReactI18next) // inicializa react-i18next
  .init({
    resources: {
      en: {
        home: homeEN,
        certifications: certificationsEN,
        dashboard: dashboardEN,
        footer: footerEN,
        header: headerEN,
        language: languageEN,
        login: loginEN,
        logout: logoutEN,
        stats: statsEN
      },
      es: {
        home: homeES,
        certifications: certificationsES,
        dashboard: dashboardES,
        footer: footerES,
        header: headerES,
        language: languageES,
        login: loginES,
        logout: logoutES,
        stats: statsES
      },
    },
    lng: 'es', // establece el idioma predeterminado
    fallbackLng: 'en', // idioma de respaldo si la traducción no está disponible
    interpolation: {
      escapeValue: false, // permite que las traducciones contengan JSX
    },
  });

export default i18n;
