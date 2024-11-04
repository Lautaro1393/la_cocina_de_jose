const db = require('../db');
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category_id, image_url } = req.body;
    

    console.log(req.body)
    console.log('Valores:', name, description, price, category_id, image_url);
    // Validaciones
    if (!name || !description || !price || !category_id || !image_url) {
      return res.status(400).json({ error: 'Campos obligatorios' });
    }

    if (isNaN(price)) {
      return res.status(400).json({ error: 'Precio inválido' });
    }

    // Actualizar producto
    const [result] = await db.query(
      'UPDATE products SET name = ?, description = ?, price = ?, category_id = ?, image_url = ? WHERE id = ?',
      [name, description, price, category_id, image_url, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto actualizado con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
};

module.exports = {
  updateProduct,
};