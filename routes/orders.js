const express = require('express');
const db = require('../db');
const authenticateToken = require('../middleware/authenticateToken');

const router = express.Router();

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { products } = req.body;
    const userId = req.user.userId;

    const [orderResult] = await db.execute(
      'INSERT INTO orders (user_id, status) VALUES (?, ?)',
      [userId, 'PENDING']
    );

    const orderId = orderResult.insertId;

    for (const product of products) {
      await db.execute(
        'INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)',
        [orderId, product.id, product.quantity]
      );
    }

    res.status(201).json({ message: 'Pedido creado exitosamente', orderId });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear pedido', error: error.message });
  }
});

router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const isAdmin = req.user.role === 'ADMIN';

    let query = `
      SELECT o.id, o.status, o.created_at, u.name as user_name, 
             JSON_ARRAYAGG(JSON_OBJECT('id', p.id, 'name', p.name, 'quantity', oi.quantity, 'price', p.price)) as items
      FROM orders o
      JOIN users u ON o.user_id = u.id
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
    `;
    let params = [];

    if (!isAdmin) {
      query += ' WHERE o.user_id = ?';
      params.push(userId);
    }

    query += ' GROUP BY o.id';

    const [orders] = await db.execute(query, params);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener pedidos', error: error.message });
  }
});

module.exports = router;