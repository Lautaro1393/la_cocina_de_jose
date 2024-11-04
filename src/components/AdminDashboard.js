import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductForm from './ProductForm';
import ProductList from './ProductList';

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleProductSubmit = async (productData) => {
    try {
      const token = localStorage.getItem('token');
      if (editingProduct) {
        await axios.put(`http://localhost:3000/api/products/${editingProduct.id}`, productData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('http://localhost:3000/api/products', productData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      fetchProducts();
      setEditingProduct(null);
    } catch (error) {
      console.error('Error submitting product:', error);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Panel de Administración</h1>
      <ProductForm onSubmit={handleProductSubmit} initialProduct={editingProduct} />
      <ProductList 
        products={products} 
        onEdit={handleEditProduct} 
        onDelete={handleDeleteProduct} 
      />
    </div>
  );
};

export default AdminDashboard;