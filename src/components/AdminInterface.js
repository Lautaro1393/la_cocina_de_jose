import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminInterface() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/products', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('category', category);
    if (image) {
      formData.append('image', image);
    }

    try {
      if (editingId) {
        await axios.put(`http://localhost:3000/api/products/${editingId}`, formData, {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        await axios.post('http://localhost:3000/api/products', formData, {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      fetchProducts();
      resetForm();
    } catch (error) {
      console.error('Error al guardar el producto:', error);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setCategory(product.category);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchProducts();
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setPrice('');
    setCategory('');
    setImage(null);
  };

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-2xl font-bold mb-4">Administración de Productos</h2>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Nombre:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Descripción:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="price" className="block text-gray-700 text-sm font-bold mb-2">Precio:</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            step="0.01"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">Categoría:</label>
          <input
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="image" className="block text-gray-700 text-sm font-bold mb-2">Imagen:</label>
          <input
            type="file"
            id="image"
            onChange={(e) => setImage(e.target.files[0])}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          {editingId ? 'Actualizar Producto' : 'Crear Producto'}
        </button>
      </form>

      <h3 className="text-xl font-bold mb-2">Lista de Productos</h3>
      <ul>
        {products.map((product) => (
          <li key={product.id} className="mb-4 p-4 border rounded">
            <h4 className="font-bold">{product.name}</h4>
            <p>{product.description}</p>
            <p>Precio: ${product.price}</p>
            <p>Categoría: {product.category}</p>
            {product.image_url && <img src={product.image_url} alt={product.name} className="mt-2 max-w-xs" />}
            <div className="mt-2">
              <button onClick={() => handleEdit(product)} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2">
                Editar
              </button>
              <button onClick={() => handleDelete(product.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}