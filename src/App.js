import React, { useState, useEffect } from 'react';
import AuthSection from './components/AuthSection';
import AdminInterface from './components/AdminInterface';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-center my-8">La Cocina de Jose</h1>
      {user ? (
        <div>
          <p>Bienvenido, {user.name}!</p>
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Cerrar Sesión
          </button>
          {user.role === 'ADMIN' && <AdminInterface />}
          {/* Aquí puedes agregar más componentes o lógica dependiendo del rol del usuario */}
        </div>
      ) : (
        <AuthSection onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}