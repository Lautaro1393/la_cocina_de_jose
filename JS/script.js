document.addEventListener('DOMContentLoaded', () => {
  const burger = document.querySelector('.burger');
  const navLinks = document.querySelector('.nav-links');
  const menuIcon = document.querySelector('.menu-icon');
  const closeIcon = document.querySelector('.close-icon');
  const menuSelect = document.getElementById('menu-select');
  const cantidadInput = document.getElementById('cantidad');
  const nombreInput = document.getElementById('nombre');
  const apellidoInput = document.getElementById('apellido');
  const fechaInput = document.getElementById('fecha');
  const agregarPedidoBtn = document.getElementById('agregar-pedido');
  const listaPedidos = document.getElementById('lista-pedidos');
  const totalPedido = document.getElementById('total-pedido');
  const enviarWhatsappBtn = document.getElementById('enviar-whatsapp');

  let token = localStorage.getItem('token');
  let user = JSON.parse(localStorage.getItem('user'));
  let pedidos = [];

  async function login(email, password) {
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        token = data.token;
        user = data.user;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  }

  async function fetchProducts() {
    try {
      const response = await fetch('http://localhost:3000/api/products', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const products = await response.json();
        return products;
      } else {
        throw new Error('Error al obtener productos');
      }
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw error;
    }
  }

  async function createOrder(products) {
    try {
      const response = await fetch('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ products }),
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error('Error al crear pedido');
      }
    } catch (error) {
      console.error('Error al crear pedido:', error);
      throw error;
    }
  }

  function toggleMenu() {
    navLinks.classList.toggle('active');
    burger.classList.toggle('active');
    menuIcon.style.display = navLinks.classList.contains('active') ? 'none' : 'inline-block';
    closeIcon.style.display = navLinks.classList.contains('active') ? 'inline-block' : 'none';
  }

  burger.addEventListener('click', toggleMenu);

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', toggleMenu);
  });

  async function renderizarProductos() {
    const products = await fetchProducts();
    const productList = document.querySelector('.product-list');
    productList.innerHTML = '';
    products.forEach(product => {
      const li = document.createElement('li');
      li.className = 'product-card';
      li.innerHTML = `
        <img src="${product.image_url}" alt="${product.name}">
        <h2>${product.name}</h2>
        <p>Precio: $${product.price}</p>
      `;
      productList.appendChild(li);
    });

    // Actualizar el menú desplegable
    menuSelect.innerHTML = '<option value="">Seleccione un menú</option>';
    products.forEach(product => {
      const option = document.createElement('option');
      option.value = product.id;
      option.textContent = product.name;
      option.dataset.precio = product.price;
      menuSelect.appendChild(option);
    });
  }

  function actualizarTotal() {
    const total = pedidos.reduce((sum, pedido) => sum + pedido.precio * pedido.cantidad, 0);
    totalPedido.textContent = `Total: $${total}`;
  }

  function renderizarPedidos() {
    listaPedidos.innerHTML = '';
    pedidos.forEach((pedido, index) => {
      const li = document.createElement('li');
      li.className = 'pedido-item';
      li.innerHTML = `
        <span>${pedido.nombre} - Cantidad: ${pedido.cantidad} - $${pedido.precio * pedido.cantidad}</span>
        <button class="eliminar-pedido" data-index="${index} <button class="eliminar-pedido" data-index="${index}">🗑️</button>
      `;
      listaPedidos.appendChild(li);
    });
    actualizarTotal();
  }

  agregarPedidoBtn.addEventListener('click', () => {
    const productoId = menuSelect.value;
    const cantidad = parseInt(cantidadInput.value);
    if (productoId && cantidad > 0) {
      const productoSeleccionado = menuSelect.options[menuSelect.selectedIndex];
      pedidos.push({
        id: productoId,
        nombre: productoSeleccionado.textContent,
        cantidad,
        precio: parseFloat(productoSeleccionado.dataset.precio)
      });
      renderizarPedidos();
      menuSelect.value = '';
      cantidadInput.value = '1';
    }
  });

  listaPedidos.addEventListener('click', (e) => {
    if (e.target.classList.contains('eliminar-pedido')) {
      const index = parseInt(e.target.getAttribute('data-index'));
      pedidos.splice(index, 1);
      renderizarPedidos();
    }
  });

  enviarWhatsappBtn.addEventListener('click', async () => {
    const nombre = nombreInput.value;
    const apellido = apellidoInput.value;
    const fecha = fechaInput.value;
    
    if (!nombre || !apellido || !fecha || pedidos.length === 0) {
      alert('Por favor, complete todos los campos y agregue al menos un pedido.');
      return;
    }

    try {
      const orderResult = await createOrder(pedidos);
      let mensaje = `Hola! mi nombre es ${nombre} ${apellido} y queria encargarte un pedido para el ${fecha}%0A de: `;
      pedidos.forEach(pedido => {
        mensaje += ` ${pedido.cantidad} ${pedido.nombre}%0A  $${pedido.precio * pedido.cantidad} ;`;
      });
      mensaje += `%0ANumero de orden: ${orderResult.orderId}`;

      const whatsappUrl = `https://wa.me/543364330643?text=${mensaje}`;
      window.open(whatsappUrl, '_blank');

      // Limpiar el pedido después de enviarlo exitosamente
      pedidos = [];
      renderizarPedidos();
      nombreInput.value = '';
      apellidoInput.value = '';
      fechaInput.value = '';
    } catch (error) {
      alert('Error al crear el pedido. Por favor, intente nuevamente.');
    }
  });

  // Inicializar la página
  renderizarProductos();
});