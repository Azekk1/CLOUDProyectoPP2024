import React, { useState } from "react";
import Section from "./Section";
import campus from "../otros/UAICAMPUS.jpg";

const LoginContainer = ({ children }) => {
  return (
    <div className="bg-slate-600 rounded-lg p-8 max-w-md mx-auto flex relative justify-center shadow-xl ring ring-slate-700 opacity-95">
      {children}
    </div>
  );
};

const Login = () => {
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
        localStorage.setItem("token", token);

        // Si la autenticación fue exitosa, obtener los datos del usuario
        const userResponse = await fetch(
          `http://localhost:4000/api/users/${email}`,
          {
            method: "GET",
          }
        );
        const userData = await userResponse.json();
        setUserData(userData);

        console.log("Nombre usuario:", userData.user_name);
        console.log("Carrera:", userData.career);
        console.log("Rol:", userData.role);
        console.log("Año de ingreso", userData.entry_year);
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
        <img src={campus} className="absolute" />
        <div className="container relative w-full h-screen">
          <div className="relative flex items-center justify-center text-center w-full z-1 mx-auto mb-[4rem] md:mb-20 lg:mb-[6rem]">
            <h1 className="h1 mb-4 mt-10 text-white relative z-10 text-center text-5xl">
              Inicia Sesión con tu usuario UAI
            </h1>
          </div>
          <LoginContainer>
            <form onSubmit={handleLogin}>
              <div className="w-full flex">
                <input
                  type="email"
                  name="email"
                  placeholder="Correo UAI"
                  id="email"
                  value={email}
                  required
                  className="border-solid border rounded text-white w-64"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <br className="my-2" />
              <div className="w-full flex">
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Contraseña"
                  value={password}
                  required
                  className=" border-solid border rounded text-white w-64"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <br className="my-2" />
              <div className=" items-center text-center relative">
                <button
                  type="submit"
                  className="mt-2 bg-slate-300 rounded text-black px-2 "
                >
                  Iniciar Sesión
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
