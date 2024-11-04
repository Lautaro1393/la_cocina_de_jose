document.addEventListener('DOMContentLoaded', () => {
    const authButton = document.getElementById('authButton');
    const authModal = document.getElementById('authModal');
    const closeBtn = authModal.querySelector('.close');
    const showLoginBtn = document.getElementById('showLoginBtn');
    const showRegisterBtn = document.getElementById('showRegisterBtn');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const adminPanel = document.getElementById('adminPanel');
    const logoutBtn = document.getElementById('logoutBtn');

    authButton.onclick = () => {
        authModal.style.display = "block";
    }

    closeBtn.onclick = () => {
        authModal.style.display = "none";
    }

    window.onclick = (event) => {
        if (event.target == authModal) {
            authModal.style.display = "none";
        }
    }

    showLoginBtn.onclick = () => {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    }

    showRegisterBtn.onclick = () => {
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
    }

    loginForm.onsubmit = async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
            
            if (!response.ok) {
                throw new Error('Error en el inicio de sesión');
            }
            
            const data = await response.json();
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', data.token);
            
            authModal.style.display = "none";
            updateUIForLoggedInUser(data.user);
        } catch (error) {
            alert(error.message);
        }
    }

    registerForm.onsubmit = async (e) => {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        
        try {
            const response = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });
            
            if (!response.ok) {
                throw new Error('Error en el registro');
            }
            
            alert('Registro exitoso. Por favor, inicia sesión.');
            showLoginBtn.click();
        } catch (error) {
            alert(error.message);
        }
    }

    logoutBtn.onclick = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        updateUIForLoggedOutUser();
    }

    function updateUIForLoggedInUser(user) {
        authButton.textContent = `Bienvenido, ${user.name}`;
        logoutBtn.classList.remove('hidden');
        if (user.role === 'ADMIN') {
            adminPanel.classList.remove('hidden');
            loadProducts();
        }
    }

    function updateUIForLoggedOutUser() {
        authButton.textContent = 'Login / Register';
        logoutBtn.classList.add('hidden');
        adminPanel.classList.add('hidden');
    }

    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        updateUIForLoggedInUser(user);
    } else {
        updateUIForLoggedOutUser();
    }

    async function loadProducts() {
        try {
            const response = await fetch('http://localhost:3000/api/products', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Error al cargar productos');
            const products = await response.json();
            displayProducts(products);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    function displayProducts(products) {
        const productList = document.getElementById('productList');
        productList.innerHTML = '';
        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.className = 'product-item';
            productElement.innerHTML = `
                <img src="${product.image_url}" alt="${product.name}" style="width: 100px; height: 100px; object-fit: cover;">
                <h3>${product.name}</h3>
                <p>Precio: $${product.price}</p>
                <p>Categoría: ${product.category}</p>
                <button onclick="showProductModal(${JSON.stringify(product)})">Editar</button>
                <button onclick="deleteProduct(${product.id})">Eliminar</button>
            `;
            productList.appendChild(productElement);
        });
    }
});

function showProductModal(product = null) {
    const modal = document.getElementById('productModal');
    const form = document.getElementById('productForm');
    const title = document.getElementById('productModalTitle');

    if (product) {
        title.textContent = 'Editar Producto';
        document.getElementById('productId').value = product.id;
        document.getElementById('productName').value = product.name;
        document.getElementById('productDescription').value = product.description;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productCategory').value = product.category;
    } else {
        title.textContent = 'Añadir Producto';
        form.reset();
        document.getElementById('productId').value = '';
    }

    modal.style.display = 'block';
}

async function handleProductSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const productId = document.getElementById('productId').value;

    try {
        const url = productId
            ? `http://localhost:3000/api/products/${productId}`
            : 'http://localhost:3000/api/products';
        const method = productId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('Error al guardar el producto');
        }

        alert(productId ? 'Producto actualizado con éxito' : 'Producto añadido con éxito');
        document.getElementById('productModal').style.display = 'none';
        loadProducts();
    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
    }
}

async function deleteProduct(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        try {
            const response = await fetch(`http://localhost:3000/api/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el producto');
            }

            alert('Producto eliminado con éxito');
            loadProducts();
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
        }
    }
}

async function loadProducts() {
    try {
        const response = await fetch('http://localhost:3000/api/products', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (!response.ok) throw new Error('Error al cargar productos');
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error:', error);
    }
}