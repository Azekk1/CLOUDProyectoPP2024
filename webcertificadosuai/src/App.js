import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';


function App() {
  const isAuthenticated = localStorage.getItem('token');
  console.log(localStorage.getItem('token'));
  
  return (
    <Router>
      <ul>
        <li>
          <Link to="/login">Login</Link>
        </li>
      </ul>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/hola" element={isAuthenticated ? <Hola /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

function WelcomePage() {
  return (
    <div>
      <h1>Bienvenidos a certificados UAI</h1>
    </div>
  );
}

function Hola() {
  return (
    <div>
      <h1>Hola</h1>
    </div>
  );
}

export default App;