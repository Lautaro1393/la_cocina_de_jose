const express = require('express');
const db = require('../db');
const authenticateToken = require('../middleware/authenticateToken');
const authorizeAdmin = require('../middleware/authorizeAdmin');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [products] = await db.execute('SELECT * FROM products');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos', error: error.message });
  }
});

router.post('/', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { name, description, price, category_id, image_url } = req.body;
    const [result] = await db.execute(
      'INSERT INTO products (name, description, price, category_id, image_url) VALUES (?, ?, ?, ?, ?)',
      [name, description, price, category_id, image_url]
    );
    res.status(201).json({ message: 'Producto creado exitosamente', productId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear producto', error: error.message });
  }
});

router.put('/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { name, description, price, category_id, image_url } = req.body;
    const [result] = await db.execute(
      'UPDATE products SET name = ?, description = ?, price = ?, category_id = ?, image_url = ? WHERE id = ?',
      [name, description, price, category_id, image_url, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar producto', error: error.message });
  }
});

router.delete('/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM products WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar producto', error: error.message });
  }
});

module.exports = router;