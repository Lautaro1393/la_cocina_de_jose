document.getElementById("login-form").addEventListener("submit", async function(event) {
    event.preventDefault();
  
    // Obtener los valores ingresados en el formulario de login
    const identifier = document.getElementById("user").value; // Nombre de usuario (o email en el futuro)
    const password = document.getElementById("password").value;
  
    // Verificar que ambos campos tengan datos
    if (!identifier || !password) {
      alert("Por favor, complete todos los campos");
      return;
    }
  
    try {
      // Enviar la solicitud POST al backend
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          identifier,
          password
        })
      });
  
      // Verificar la respuesta del servidor
      if (response.ok) {
        const data = await response.json();
        alert(data.message); // Mostrar mensaje de login exitoso
        window.location.href = data.redirect; // Redirigir a la página correspondiente
      } else {
        // Mostrar mensaje de error en caso de fallar el login
        const errorData = await response.json();
        alert(errorData.message);
      }
    } catch (error) {
      console.error("Error al intentar iniciar sesión:", error);
      alert("Error al intentar iniciar sesión, por favor intente nuevamente");
    }
  });
  