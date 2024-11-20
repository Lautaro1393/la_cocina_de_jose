document.getElementsByTagName("button")[0].addEventListener("click", async () => {
    try {
      // Enviar una solicitud GET al backend para eliminar la cookie JWT
      const response = await fetch("http://localhost:3000/api/logout", {
        method: "GET",
        credentials: "include" // Asegura que la cookie JWT sea enviada junto con la solicitud
      });
  
      if (response.ok) {
        const data = await response.json();
        alert(data.message); // Mostrar mensaje de sesión cerrada exitosamente
        window.location.href = data.redirect; // Redirigir a la página de inicio
      } else {
        alert("Error al cerrar la sesión, por favor intente nuevamente");
      }
    } catch (error) {
      console.error("Error al intentar cerrar la sesión:", error);
      alert("Error al intentar cerrar la sesión, por favor intente nuevamente");
    }
  });
  