import React, { useState, useEffect } from 'react';

const ProductForm = ({ onSubmit, initialProduct }) => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: null
  });

  useEffect(() => {
    if (initialProduct) {
      setProduct(initialProduct);
    }
  }, [initialProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prevProduct => ({
      ...prevProduct,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    setProduct(prevProduct => ({
      ...prevProduct,
      image: e.target.files[0]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in product) {
      formData.append(key, product[key]);
    }
    onSubmit(formData);
    setProduct({ name: '', description: '', price: '', category: '', image: null });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
        <input
          type="text"
          id="name"
          name="name"
          value={product.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
        <textarea
          id="description"
          name="description"
          value={product.description}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Precio</label>
        <input
          type="number"
          id="price"
          name="price"
          value={product.price}
          onChange={handleChange}
          required
          step="0.01"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Categoría</label>
        <input
          type="text"
          id="category"
          name="category"
          value={product.category}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="image" className="block text-sm font-medium text-gray-700">Imagen</label>
        <input
          type="file"
          id="image"
          name="image"
          onChange={handleImageChange}
          accept="image/*"
          className="mt-1 block w-full"
        />
      </div>
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        {initialProduct ? 'Actualizar Producto' : 'Crear Producto'}
      </button>
    </form>
  );
};

export default ProductForm;