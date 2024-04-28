import logouai from "../otros/logouai.svg";
import { useLocation } from "react-router-dom";
import MenuSvg from "../otros/svg/MenuSvg";
import { HamburgerMenu } from "../design/Header";
import { useState } from "react";
import Button from "./Button";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import '../Multilenguaje/i18n';
import LogoutButton from "./LogoutButton";

const Header = () => {
  const { t } = useTranslation('header');

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


  // pestañas de navegación
  const navigationItems = [
    { id: 0, title: t('dashboard'), href: "/dashboard", onlyMobile: false },
    {
      id: 1,
      title: t('certificates'),
      href: "/certificaciones",
      onlyMobile: false,
    },
    { id: 2, title: t('login'), href: "/login", onlyMobile: false },
    {id: 3, title: t('language'), href: "/language", onlyMobile: false},
  ];

  return (
    <div
      className={`fixed top-0 w-full z-50 border-b border-white lg:bg-n-8/90 lg:backdrop-blur-sm ${
        openNavigation ? "bg-n-8" : "bg-n-8/90 backdrop-blur-sm"
      }`}
    >
      <div className="flex items-center px-5 lg:px-7.5 xl:px-10 max-lg:py-4:">
        <a className="block w-[12rem] xl:mr-8" href="/">
          <img src={logouai} width={190} height={40} alt="UAI" />
        </a>
        <nav
          className={`flex flex-col items-center justify-center ${
            openNavigation
              ? "fixed top-0 left-0 right-0 bottom-0 bg-n-8"
              : "hidden lg:flex lg:static lg:bg-transparent"
          }`}
        >
          <div className="relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row">
            {navigationItems.map((item) => (
              <Link
                key={item.id}
                to={item.href}
                onClick={handleClick}
                className={`px-12 block relative font-prueba2 text-xl uppercase text-n-1 transition-colors hover:text-sky-400 lg:text-base lg:font-semibold ${
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
      </div>
    </div>
  );
};

export default Header;
