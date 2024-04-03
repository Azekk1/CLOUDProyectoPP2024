import React, { useState } from 'react';
import './App.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userData, setUserData] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log(data.message);
        // Si la autenticación fue exitosa, obtener los datos del usuario
        const userResponse = await fetch(`http://localhost:4000/api/users/${email}`, {
          method: 'GET',
        });
        const userData = await userResponse.json();
        setUserData(userData);
        console.log('Nombre usuario:', userData.user_name);
        console.log('ID carrera', userData.career_id);
        console.log('ID rol', userData.role_id);
        console.log('Año de ingreso', userData.entry_year);
      } else {
        console.error('Error al iniciar sesión:', data.message);
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Login Page</h1>
        <form onSubmit={handleLogin}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br/>
          <button type="submit">
            Login
          </button>
        </form>
      </header>
    </div>
  );
}

export default LoginPage;