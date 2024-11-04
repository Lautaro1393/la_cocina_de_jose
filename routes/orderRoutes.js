const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken, authorizeAdmin } = require('../middleware/authMiddleware');

// Crear un nuevo pedido
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { items, total } = req.body;
    const [result] = await db.query(
      'INSERT INTO orders (user_id, total, status) VALUES (?, ?, ?)',
      [req.user.userId, total, 'PENDING']
    );
    const orderId = result.insertId;

    // Insertar los items del pedido
    for (let item of items) {
      await db.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.productId, item.quantity, item.price]
      );
    }

    res.status(201).json({ message: 'Pedido creado exitosamente', orderId });
  } catch (error) {
    console.error('Error al crear el pedido:', error);
    res.status(500).json({ message: 'Error al crear el pedido' });
  }
});

// Obtener todos los pedidos (solo admin)
router.get('/', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const [orders] = await db.query('SELECT * FROM orders');
    res.json(orders);
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ message: 'Error al obtener pedidos' });
  }
});

// Obtener pedidos del usuario autenticado
router.get('/my-orders', authenticateToken, async (req, res) => {
  try {
    const [orders] = await db.query('SELECT * FROM orders WHERE user_id = ?', [req.user.userId]);
    res.json(orders);
  } catch (error) {
    console.error('Error al obtener pedidos del usuario:', error);
    res.status(500).json({ message: 'Error al obtener pedidos del usuario' });
  }
});

// Obtener un pedido específico
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const [orders] = await db.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (orders.length === 0) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }
    
    // Verificar si el usuario es admin o si el pedido pertenece al usuario autenticado
    if (req.user.role !== 'ADMIN' && orders[0].user_id !== req.user.userId) {
      return res.status(403).json({ message: 'No tienes permiso para ver este pedido' });
    }

    // Obtener los items del pedido
    const [items] = await db.query('SELECT * FROM order_items WHERE order_id = ?', [req.params.id]);
    orders[0].items = items;

    res.json(orders[0]);
  } catch (error) {
    console.error('Error al obtener el pedido:', error);
    res.status(500).json({ message: 'Error al obtener el pedido' });
  }
});

// Actualizar el estado de un pedido (solo admin)
router.put('/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const [result] = await db.query(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }
    res.json({ message: 'Estado del pedido actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar el estado del pedido:', error);
    res.status(500).json({ message: 'Error al actualizar el estado del pedido' });
  }
});

module.exports = router;