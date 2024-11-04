const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../db');
const { authenticateToken, authorizeAdmin } = require('../middleware/authMiddleware');
const productController = require('./productController');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/products')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Error: File upload only supports the following filetypes - " + filetypes));
  }
});

router.get('/', async (req, res) => {
  try {
    const [products] = await db.query('SELECT * FROM products');
    res.json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ message: 'Error al obtener productos', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [products] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (products.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(products[0]);
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    res.status(500).json({ message: 'Error al obtener el producto', error: error.message });
  }
});

router.post('/', authenticateToken, authorizeAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category_id } = req.body;
    const image_url = req.file ? `/images/products/${req.file.filename}` : null;

    if (!name || !description || !price || !category_id) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    const [result] = await db.query(
      'INSERT INTO products (name, description, price, category_id, image_url) VALUES (?, ?, ?, ?, ?)',
      [name, description, price, category_id, image_url]
    );
    res.status(201).json({ message: 'Producto creado exitosamente', productId: result.insertId });
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).json({ message: 'Error al crear el producto', error: error.message });
  }
});

// router.put('/:id', authenticateToken, authorizeAdmin, upload.single('image'), async (req, res) => {
//   try {
//     const { name, description, price, category } = req.body;
//     let image_url = req.file ? `/images/products/${req.file.filename}` : null;

//     if (!image_url) {
//       const [currentProduct] = await db.query('SELECT image_url FROM products WHERE id = ?', [req.params.id]);
//       image_url = currentProduct[0].image_url;
//     }

//     const [result] = await db.query(
//       'UPDATE products SET name = ?, description = ?, price = ?, category = ?, image_url = ? WHERE id = ?',
//       [name, description, price, category, image_url, req.params.id]
//     );
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'Producto no encontrado' });
//     }
//     res.json({ message: 'Producto actualizado exitosamente' });
//   } catch (error) {
//     console.error('Error al actualizar el producto:', error);
//     res.status(500).json({ message: 'Error al actualizar el producto', error: error.message });
//   }
// });
router.put('/:id', authenticateToken, authorizeAdmin, upload.single('image'), productController.updateProduct);


router.delete('/:id', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).json({ message: 'Error al eliminar el producto', error: error.message });
  }
});

module.exports = router;