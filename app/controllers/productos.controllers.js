
import connection from '../index.js';

// Obtener todos los productos
async function obtenerProductos(req, res) {
    try {
        connection.query('SELECT * FROM productos', (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send({ status: "Error", message: "Error al obtener productos" });
            }
            return res.status(200).send({ status: "ok", data: results });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ status: "Error", message: "Error del servidor" });
    }
}

// Obtener producto por ID
async function obtenerProductoPorId(req, res) {
    const { id } = req.params;
    try {
        connection.query('SELECT * FROM productos WHERE id = ?', [id], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send({ status: "Error", message: "Error al obtener el producto" });
            }
            if (results.length === 0) {
                return res.status(404).send({ status: "Error", message: "Producto no encontrado" });
            }
            return res.status(200).send({ status: "ok", data: results[0] });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ status: "Error", message: "Error del servidor" });
    }
}

// Crear un nuevo producto
async function crearProducto(req, res) {
    const { nombre, descripcion, precio, imagen } = req.body;

    if (!nombre || !descripcion || !precio || !imagen) {
        return res.status(400).send({ status: "Error", message: "Todos los campos son requeridos" });
    }

    try {
        connection.query(
            'INSERT INTO productos (nombre, descripcion, precio, imagen, fecha_creacion) VALUES (?, ?, ?, ?, NOW())',
            [nombre, descripcion, precio, imagen],
            (err, results) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send({ status: "Error", message: "Error al crear el producto" });
                }
                return res.status(201).send({ status: "ok", message: "Producto creado con éxito", data: { id: results.insertId, nombre, descripcion, precio, imagen } });
            }
        );
    } catch (error) {
        console.error(error);
        return res.status(500).send({ status: "Error", message: "Error del servidor" });
    }
}

// Actualizar producto
async function actualizarProducto(req, res) {
    const { id } = req.params;
    const { nombre, descripcion, precio, imagen } = req.body;

    if (!nombre || !descripcion || !precio || !imagen) {
        return res.status(400).send({ status: "Error", message: "Todos los campos son requeridos" });
    }

    try {
        connection.query(
            'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, imagen = ? WHERE id = ?',
            [nombre, descripcion, precio, imagen, id],
            (err, results) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send({ status: "Error", message: "Error al actualizar el producto" });
                }
                if (results.affectedRows === 0) {
                    return res.status(404).send({ status: "Error", message: "Producto no encontrado" });
                }
                return res.status(200).send({ status: "ok", message: "Producto actualizado con éxito" });
            }
        );
    } catch (error) {
        console.error(error);
        return res.status(500).send({ status: "Error", message: "Error del servidor" });
    }
}

// Eliminar producto
async function eliminarProducto(req, res) {
    const { id } = req.params;

    try {
        connection.query('DELETE FROM productos WHERE id = ?', [id], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send({ status: "Error", message: "Error al eliminar el producto" });
            }
            if (results.affectedRows === 0) {
                return res.status(404).send({ status: "Error", message: "Producto no encontrado" });
            }
            return res.status(200).send({ status: "ok", message: "Producto eliminado con éxito" });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ status: "Error", message: "Error del servidor" });
    }
}

export const methods = {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto
};
