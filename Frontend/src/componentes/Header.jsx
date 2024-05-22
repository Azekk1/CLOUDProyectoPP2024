import logouai from "../otros/logouai.svg";
import { useLocation } from "react-router-dom";
import MenuSvg from "../otros/svg/MenuSvg";
import { HamburgerMenu } from "../design/Header";
import { useState, useEffect } from "react";
import Button from "./Button";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../Multilenguaje/i18n";
import LogoutButton from "./LogoutButton";
import LanguageSwitcher from "./LanguageSwitcher";
import Logout from "./LogoutButton";

const Header = () => {
  const { t } = useTranslation("header");

  const pathname = useLocation();
  const [openNavigation, setopenNavigation] = useState(false);

  const toggleNavigation = () => {
    if (openNavigation) {
      setopenNavigation(false);
      enablePageScroll();
    } else {
      setopenNavigation(true);
      disablePageScroll();
    }
  };

  const handleClick = () => {
    if (!openNavigation) return;
    enablePageScroll();
    setopenNavigation(false);
  };

  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("token")
  );

  const isTokenExpired = () => {
    const expirationTime = localStorage.getItem("expirationTime");
    if (!expirationTime) {
      return true; // Si no hay una fecha de expiración, consideramos que el token ha expirado
    }
    return new Date() > new Date(expirationTime); // Comparamos la fecha actual con la fecha de expiración
  };

  useEffect(() => {
    if (isAuthenticated && isTokenExpired()) {
      // Si el usuario está autenticado pero el token ha expirado, eliminamos el token y actualizamos el estado de autenticación
      localStorage.removeItem("token");
      localStorage.removeItem("expirationTime");
      setIsAuthenticated(false);
    }
  }, [isAuthenticated]);

  console.log(localStorage.getItem("token"));

  // pestañas de navegación
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
      <div className="flex items-center px-5 lg:px-7.5 xl:px-10 max-lg:py-4">
        <a className="block w-[12rem] xl:mr-8" href="/">
          <img src={logouai} width={190} height={40} alt="UAI" />
        </a>
        <nav
          className={`flex flex-col items-center justify-center ${
            openNavigation
              ? "fixed top-0 left-0 right-0 bottom-0 bg-primary"
              : "hidden lg:flex lg:static lg:bg-transparent"
          }`}
        >
          <div className="relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row">
            {navigationItems.map((item) => (
              <Link
                key={item.id}
                to={item.href}
                onClick={handleClick}
                className={`px-12 block relative font-prueba2 text-xl uppercase text-text2 transition-colors hover:text-sky-400 lg:text-base lg:font-semibold ${
                  item.url === pathname.pathname ? "z-2" : ""
                } ${openNavigation ? "py-20 text-3xl" : ""}`}
              >
                {item.title}
              </Link>
            ))}
          </div>
          <HamburgerMenu />
        </nav>{" "}
        <Button
          className="ml-auto lg:hidden px='px-3"
          onClick={toggleNavigation}
        >
          <MenuSvg openNavigation={openNavigation} />
        </Button>
        <LanguageSwitcher />
        {isAuthenticated && <Logout />}
      </div>
    </div>
  );
};

export default Header;
