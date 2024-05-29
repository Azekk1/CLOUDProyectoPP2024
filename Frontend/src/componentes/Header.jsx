import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import logouai from "../otros/logouai.svg";
import MenuSvg from "../otros/svg/MenuSvg";
import Button from "./Button";
import LanguageSwitcher from "./LanguageSwitcher";
import LogoutButton from "./LogoutButton";
import { useTranslation } from "react-i18next";
import "../Multilenguaje/i18n";

const Header = ({ isAuthenticated }) => {
  const { t } = useTranslation("header");
  const pathname = useLocation();
  const [openNavigation, setOpenNavigation] = useState(false);

  const toggleNavigation = () => {
    if (openNavigation) {
      setOpenNavigation(false);
      enablePageScroll();
    } else {
      setOpenNavigation(true);
      disablePageScroll();
    }
  };

  const handleClick = () => {
    if (!openNavigation) return;
    enablePageScroll();
    setOpenNavigation(false);
  };

  // Pestañas de navegación
  const navigationItems = [
    { id: 0, title: t("dashboard"), href: "/dashboard", onlyMobile: false },
    {
      id: 1,
      title: t("certificates"),
      href: "/certificaciones",
      onlyMobile: false,
    },
    // Incluye el enlace al inicio de sesión solo si el usuario no está autenticado
    !isAuthenticated && {
      id: 2,
      title: t("login"),
      href: "/login",
      onlyMobile: false,
    },
  ].filter(Boolean);

  return (
    <div
      className={`fixed top-0 w-full z-50 border-b border-white lg:bg-primary lg:backdrop-blur-sm ${
        openNavigation ? "bg-primary" : "bg-primary backdrop-blur-sm"
      }`}
    >
      <div className="flex items-center justify-between px-5 lg:px-7.5 xl:px-10 ">
        <div className="flex items-center">
          <Link className="block w-[12rem] xl:mr-8" to="/">
            <img src={logouai} width={190} height={40} alt="UAI" />
          </Link>
          <nav className="hidden lg:flex items-center">
            {navigationItems.map((item) => (
              <Link
                key={item.id}
                to={item.href}
                onClick={handleClick}
                className={`px-4 font-prueba2 text-xl uppercase text-text2 transition-colors hover:text-sky-400 lg:text-base lg:font-semibold ${
                  item.url === pathname.pathname ? "text-accent" : ""
                }`}
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center">
          <LanguageSwitcher />
          {isAuthenticated && <LogoutButton />}
          <div className="lg:hidden ml-3">
            <Button className="px-3" onClick={toggleNavigation}>
              <MenuSvg openNavigation={openNavigation} />
            </Button>
          </div>
        </div>
      </div>
      {openNavigation && (
        <nav className="fixed top-0 left-0 right-0 bottom-0 bg-primary lg:hidden">
          <div className="flex flex-col items-center justify-center h-full">
            {navigationItems.map((item) => (
              <Link
                key={item.id}
                to={item.href}
                onClick={handleClick}
                className={`py-4 font-prueba2 text-3xl uppercase text-text2 transition-colors hover:text-accent`}
              >
                {item.title}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
};

export default Header;
