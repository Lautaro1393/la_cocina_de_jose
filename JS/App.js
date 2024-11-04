const { useState, useEffect } = React;

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-center my-8">La Cocina de Jose</h1>
      {user ? (
        <>
          <div className="mb-4">
            <p>Bienvenido, {user.name}!</p>
            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Cerrar Sesión
            </button>
          </div>
          {user.role === 'ADMIN' && <AdminInterface />}
        </>
      ) : (
        <div className="flex justify-around">
          <div className="w-1/2">
            <h2 className="text-2xl font-bold mb-4">Registro</h2>
            <RegisterForm />
          </div>
          <div className="w-1/2">
            <h2 className="text-2xl font-bold mb-4">Iniciar Sesión</h2>
            <LoginForm onLoginSuccess={handleLoginSuccess} />
          </div>
        </div>
      )}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));