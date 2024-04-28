import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import '../Multilenguaje/i18n';

const LanguageSwitcher = () => {
  const { t } = useTranslation('language');

  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    navigate('/');
  };

  return (
    <div className="container relative w-full text-center">
        <div>
            <button onClick={() => changeLanguage('en')}>{t('english')}</button>
        </div> 
        <div>
            <button onClick={() => changeLanguage('es')}>{t('spanish')}</button>
        </div>
      {/* Agrega más botones según los idiomas que quieras soportar */}
    </div>
  );
};

export default LanguageSwitcher;
