// Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Section from "./Section";
import campus from "../otros/UAICAMPUS.jpg";
import { useTranslation } from "react-i18next";
import "../Multilenguaje/i18n";

const LoginContainer = ({ children }) => {
  return (
    <div className="bg-primary rounded-xl p-8 max-w-md mx-auto flex relative justify-center shadow-xl">
      {children}
    </div>
  );
};

const Login = ({ setIsAuthenticated }) => {
  const { t } = useTranslation("login");
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userData, setUserData] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Inicio de sesión exitoso");

        const token = data.token;
        const expirationTime = data.expirationTime;
        localStorage.setItem("token", token);
        localStorage.setItem("expirationTime", expirationTime);

        setIsAuthenticated(true); // Actualiza el estado de autenticación
        navigate("/redirect");
        navigate("/dashboard", { state: { username: userData.user_name } });
      } else {
        console.error("Error al iniciar sesión:", data.message);
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  return (
    <Section
      className="pt-[12rem] -mt-[5.25] md:-mt-0 " // Ajuste del margen superior en dispositivos medianos y grandes
      crosses
      crossesOffset="lg:translate-y-[5.25rem]"
      customPaddings
      id="login"
      // Añade el estilo para la imagen de fondo
    >
      <div className="w-full bg-cover bg-center relative">
        <img
          src={campus}
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="container relative w-full h-screen">
          <div className="relative flex items-center justify-center text-center w-full z-1 mx-auto mb-[4rem] md:mb-20 lg:mb-[6rem]">
            <h1 className="h1 mb-4 mt-10 text-text relative z-10 text-center text-5xl">
              {t("message")}
            </h1>
          </div>
          <LoginContainer>
            <form onSubmit={handleLogin}>
              <div className="w-full flex">
                <input
                  type="email"
                  name="email"
                  placeholder={t("mail")}
                  id="email"
                  value={email}
                  required
                  className="border-solid border rounded text-text2 w-64"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <br className="my-2" />
              <div className="w-full flex">
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder={t("password")}
                  value={password}
                  required
                  className=" border-solid border rounded text-text2 w-64"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <br className="my-2" />
              <div className=" items-center text-center relative">
                <button
                  type="submit"
                  className="mt-2 bg-secondary rounded text-text px-2 "
                >
                  {t("login")}
                </button>
              </div>
            </form>
          </LoginContainer>
        </div>
      </div>
    </Section>
  );
};

export default Login;
