// app/controllers/pedidos.controllers.js

import connection from '../index.js';

// Obtener todos los pedidos
async function obtenerPedidos(req, res) {
    try {
        connection.query('SELECT * FROM pedidos', (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send({ status: "Error", message: "Error al obtener pedidos" });
            }
            return res.status(200).send({ status: "ok", data: results });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ status: "Error", message: "Error del servidor" });
    }
}

// Obtener pedido por ID
async function obtenerPedidoPorId(req, res) {
    const { id } = req.params;
    try {
        connection.query('SELECT * FROM pedidos WHERE id = ?', [id], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send({ status: "Error", message: "Error al obtener el pedido" });
            }
            if (results.length === 0) {
                return res.status(404).send({ status: "Error", message: "Pedido no encontrado" });
            }
            return res.status(200).send({ status: "ok", data: results[0] });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ status: "Error", message: "Error del servidor" });
    }
}

// Crear un nuevo pedido
async function crearPedido(req, res) {
    const { usuario_id, fecha_pedido, estado, producto_id } = req.body;

    // Validar que todos los campos requeridos estén presentes
    if (!usuario_id || !fecha_pedido || !estado || !producto_id) {
        return res.status(400).send({ status: "Error", message: "Todos los campos son requeridos" });
    }

    try {
        connection.query(
            'INSERT INTO pedidos (usuario_id, fecha_pedido, estado, producto_id) VALUES (?, ?, ?, ?)',
            [usuario_id, fecha_pedido, estado, producto_id],
            (err, results) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send({ status: "Error", message: "Error al crear el pedido" });
                }
                return res.status(201).send({ status: "ok", message: "Pedido creado con éxito", data: { id: results.insertId, usuario_id, fecha_pedido, estado, producto_id } });
            }
        );
    } catch (error) {
        console.error(error);
        return res.status(500).send({ status: "Error", message: "Error del servidor" });
    }
}


// Actualizar pedido
async function actualizarPedido(req, res) {
    const { id } = req.params;
    const { usuario_id, fecha_pedido, estado } = req.body;

    if (!usuario_id || !fecha_pedido || !estado) {
        return res.status(400).send({ status: "Error", message: "Todos los campos son requeridos" });
    }

    try {
        connection.query(
            'UPDATE pedidos SET usuario_id = ?, fecha_pedido = ?, estado = ? WHERE id = ?',
            [usuario_id, fecha_pedido, estado, id],
            (err, results) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send({ status: "Error", message: "Error al actualizar el pedido" });
                }
                if (results.affectedRows === 0) {
                    return res.status(404).send({ status: "Error", message: "Pedido no encontrado" });
                }
                return res.status(200).send({ status: "ok", message: "Pedido actualizado con éxito" });
            }
        );
    } catch (error) {
        console.error(error);
        return res.status(500).send({ status: "Error", message: "Error del servidor" });
    }
}

// Eliminar pedido
async function eliminarPedido(req, res) {
    const { id } = req.params;

    try {
        connection.query('DELETE FROM pedidos WHERE id = ?', [id], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send({ status: "Error", message: "Error al eliminar el pedido" });
            }
            if (results.affectedRows === 0) {
                return res.status(404).send({ status: "Error", message: "Pedido no encontrado" });
            }
            return res.status(200).send({ status: "ok", message: "Pedido eliminado con éxito" });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ status: "Error", message: "Error del servidor" });
    }
}

export const methods = {
    obtenerPedidos,
    obtenerPedidoPorId,
    crearPedido,
    actualizarPedido,
    eliminarPedido
};
