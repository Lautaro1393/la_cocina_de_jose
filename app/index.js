// IMPORTACION DE DEPENDENCIAS
import express from "express";
import mysql from "mysql2";
import cookieParser from "cookie-parser";
import path from 'path';
import { fileURLToPath } from "url";

import { methods as pedidosController } from "./controllers/pedidos.controllers.js";
import { methods as productosController } from "./controllers/productos.controllers.js";
// FIX PARA EL DIRNAME
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// AUTHENTICATION
import { methods as authentication } from "./controllers/authentication.controllers.js"

// MIDDLEWARES Authorization
import { methods as authorization } from "./middleware/authorization.js";

// SERVER
const app = express();  // <- Aquí se inicializa el servidor Express
app.set("port", 3000);
app.listen(app.get("port"));
console.log("hola servidor activo en puerto", app.get("port"));

// CONFIGURACION
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));

// CONEXION A LA BASE DE DATOS
const connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password: "",
    database: "la_cocina_de_jose"
});

connection.connect((err) => {
    if (err){
        console.error("Error al conectar la base de datos" + err.stack);
        return;
    }
    console.log("Conectado a la base de datos con ID " + connection.threadId);
});

// Exportar la conexion para usarla en otros archivos
export default connection;

// RUTAS PUBLICAS (SIN AUTENTICACIÓN)
app.get("/", authorization.soloPublico, (req, res) => res.sendFile(__dirname + "/pages/index.html"));
app.get("/register", authorization.soloPublico, (req, res) => res.sendFile(__dirname + "/pages/register.html"));
app.get("/login", authorization.soloPublico, (req, res) => res.sendFile(__dirname + "/pages/login.html"));

// RUTA PARA USUARIOS COMUNES
app.get("/perfil", authorization.soloUsuarios, (req, res) => {
  res.sendFile(__dirname + "/pages/perfil.html");
});

// RUTA PARA ADMINISTRADORES
app.get("/admin", authorization.soloAdmin, (req, res) => {
  res.sendFile(__dirname + "/pages/admin/admin.html");
});

// AUTENTICACIÓN (LOGIN Y LOGOUT)
app.post("/api/login", authentication.login);
app.post("/api/register", authentication.register);
app.get("/api/logout", (req, res) => {
  res.clearCookie("jwt");
  return res.status(200).send({ status: "ok", message: "Sesión cerrada exitosamente", redirect: "/" });
});


// RUTAS DE PRODUCTOS
app.get("/api/productos", productosController.obtenerProductos);
app.get("/api/productos/:id", productosController.obtenerProductoPorId);
app.post("/api/productos", authorization.soloAdmin, productosController.crearProducto);
app.put("/api/productos/:id", authorization.soloAdmin, productosController.actualizarProducto);
app.delete("/api/productos/:id", authorization.soloAdmin, productosController.eliminarProducto);


// Rutas de pedidos
app.get("/api/pedidos", pedidosController.obtenerPedidos);
app.get("/api/pedidos/:id", pedidosController.obtenerPedidoPorId);
app.post("/api/pedidos", pedidosController.crearPedido);
app.put("/api/pedidos/:id", pedidosController.actualizarPedido);
app.delete("/api/pedidos/:id", pedidosController.eliminarPedido);
