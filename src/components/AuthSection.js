import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default function AuthSection({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-section">
      <div className="auth-toggle">
        <button
          className={`auth-toggle-btn ${isLogin ? 'active' : ''}`}
          onClick={() => setIsLogin(true)}
        >
          Iniciar Sesión
        </button>
        <button
          className={`auth-toggle-btn ${!isLogin ? 'active' : ''}`}
          onClick={() => setIsLogin(false)}
        >
          Registrarse
        </button>
      </div>
      {isLogin ? (
        <LoginForm onLoginSuccess={onLoginSuccess} />
      ) : (
        <RegisterForm onRegisterSuccess={() => setIsLogin(true)} />
      )}
    </div>
  );
}