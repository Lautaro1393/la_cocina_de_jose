document.addEventListener('DOMContentLoaded', () => {
    const adminPanel = document.getElementById('adminPanel');
    const productForm = document.getElementById('productForm');
    const productList = document.getElementById('productList');

    async function loadProducts() {
        try {
            const response = await fetch('product_routes.php');
            const products = await response.json();
            displayProducts(products);
        } catch (error) {
            console.error('Error al cargar productos:', error);
        }
    }

    function displayProducts(products) {
        productList.innerHTML = '';
        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.className = 'product-item';
            productElement.innerHTML = `
                <img src="${product.image_url}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>Precio: $${product.price}</p>
                <p>Categoría: ${product.category}</p>
                <div class="actions">
                    <button onclick="editProduct(${product.id})">Editar</button>
                    <button onclick="deleteProduct(${product.id})">Eliminar</button>
                </div>
            `;
            productList.appendChild(productElement);
        });
    }

    productForm.onsubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(productForm);
        const productId = formData.get('id');
        const url = productId ? `product_routes.php?id=${productId}` : 'product_routes.php';
        const method = productId ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                body: formData
            });

            if (!response.ok) {
                throw new Error('Error al guardar el producto');
            }

            alert(productId ? 'Producto actualizado con éxito' : 'Producto añadido con éxito');
            productForm.reset();
            loadProducts();
        } catch (error) {
            console.error('Error:', error);
            alert(error.message);
        }
    };

    window.editProduct = async (id) => {
        try {
            const response = await fetch(`product_routes.php?id=${id}`);
            const product = await response.json();
            
            document.getElementById('productId').value = product.id;
            document.getElementById('productName').value = product.name;
            document.getElementById('productDescription').value = product.description;
            document.getElementById('productPrice').value = product.price;
            
            document.getElementById('productCategory').value = product.category;
        } catch (error) {
            console.error('Error al cargar el producto:', error);
        }
    };

    window.deleteProduct = async (id) => {
        if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            try {
                const response = await fetch(`product_routes.php?id=${id}`, {
                    method: 'DELETE'
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
    };

    loadProducts();
});