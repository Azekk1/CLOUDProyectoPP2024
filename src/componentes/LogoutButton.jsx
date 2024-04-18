import React from 'react';
import axios from 'axios';

const LogoutButton = () => {
  const handleLogout = async () => {
    try {
      // Envía una solicitud al backend para cerrar sesión
      await axios.post('http://localhost:5000/logout');

      // Eliminar el token de acceso del localStorage
      localStorage.removeItem('token');
      console.log('Token: ', localStorage.getItem('token'));

      // Redirigir a la página de inicio de sesión o a otra página
      window.location.href = '/login';

    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <button onClick={handleLogout}>Cerrar sesión</button>
  );
};

export default LogoutButton;