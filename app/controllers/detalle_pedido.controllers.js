// app/controllers/detalle_pedido.controllers.js

import connection from '../index.js';

// Obtener todos los detalles de pedidos
async function obtenerDetallesPedido(req, res) {
    try {
        connection.query('SELECT * FROM detalle_pedido', (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send({ status: "Error", message: "Error al obtener detalles del pedido" });
            }
            return res.status(200).send({ status: "ok", data: results });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ status: "Error", message: "Error del servidor" });
    }
}

// Obtener detalle de pedido por ID
async function obtenerDetallePedidoPorId(req, res) {
    const { id } = req.params;
    try {
        connection.query('SELECT * FROM detalle_pedido WHERE id = ?', [id], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send({ status: "Error", message: "Error al obtener el detalle del pedido" });
            }
            if (results.length === 0) {
                return res.status(404).send({ status: "Error", message: "Detalle del pedido no encontrado" });
            }
            return res.status(200).send({ status: "ok", data: results[0] });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ status: "Error", message: "Error del servidor" });
    }
}

async function crearDetallePedido(req, res) {
    const { pedido_id, producto_id, cantidad, precio } = req.body;

    if (!pedido_id || !producto_id || !cantidad || !precio) {
        return res.status(400).send({ status: "Error", message: "Todos los campos son requeridos" });
    }

    try {
        connection.query(
            'INSERT INTO detalle_pedido (pedido_id, producto_id, cantidad, precio) VALUES (?, ?, ?, ?)',
            [pedido_id, producto_id, cantidad, precio],
            (err, results) => {
                if (err) {
                    console.error("Error SQL:", err.message);
                    return res.status(500).send({ status: "Error", message: "Error al crear el detalle del pedido" });
                }
                return res.status(201).send({ status: "ok", message: "Detalle del pedido creado con éxito", data: { id: results.insertId, pedido_id, producto_id, cantidad, precio } });
            }
        );
    } catch (error) {
        console.error(error);
        return res.status(500).send({ status: "Error", message: "Error del servidor" });
    }
}


// Actualizar detalle de pedido
async function actualizarDetallePedido(req, res) {
    const { id } = req.params;
    const { pedido_id, producto_id, cantidad, precio } = req.body;

    if (!pedido_id || !producto_id || !cantidad || !precio) {
        return res.status(400).send({ status: "Error", message: "Todos los campos son requeridos" });
    }

    try {
        connection.query(
            'UPDATE detalle_pedido SET pedido_id = ?, producto_id = ?, cantidad = ?, precio = ? WHERE id = ?',
            [pedido_id, producto_id, cantidad, precio, id],
            (err, results) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send({ status: "Error", message: "Error al actualizar el detalle del pedido" });
                }
                if (results.affectedRows === 0) {
                    return res.status(404).send({ status: "Error", message: "Detalle del pedido no encontrado" });
                }
                return res.status(200).send({ status: "ok", message: "Detalle del pedido actualizado con éxito" });
            }
        );
    } catch (error) {
        console.error(error);
        return res.status(500).send({ status: "Error", message: "Error del servidor" });
    }
}

// Eliminar detalle de pedido
async function eliminarDetallePedido(req, res) {
    const { id } = req.params;

    try {
        connection.query('DELETE FROM detalle_pedido WHERE id = ?', [id], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).send({ status: "Error", message: "Error al eliminar el detalle del pedido" });
            }
            if (results.affectedRows === 0) {
                return res.status(404).send({ status: "Error", message: "Detalle del pedido no encontrado" });
            }
            return res.status(200).send({ status: "ok", message: "Detalle del pedido eliminado con éxito" });
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ status: "Error", message: "Error del servidor" });
    }
}

export const methods = {
    obtenerDetallesPedido,
    obtenerDetallePedidoPorId,
    crearDetallePedido,
    actualizarDetallePedido,
    eliminarDetallePedido
};
