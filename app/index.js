// IMPORTACION DE DEPENDENCIAS

import express from "express";
import mysql from "mysql2";
import cookieParser from "cookie-parser";


// FIX PARA EL DIRNAME

import path from 'path'
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));


// AUTHENTICATION

import { methods as authentication } from "./controllers/authentication.controllers.js"

// MIDDLEWARES Authorization

import { methods as authorization } from "./middleware/authorization.js";



//SERVER

const app = express();
app.set("port", 3000);
app.listen(app.get("port"));
console.log("hola servidor activo en puerto", app.get("port"));

// CONFIGURACION

app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));

// CONEXION A LA BASE DE DATOS

const connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password: "",
    database: "la_cocina_de_jose"
});

connection.connect((err)=> {
    if (err){
        console.error("Error al conectar la base de datos"+ err.stack);
        return;
    }
    console.log("Conectado a la basde de datos con ID" + connection.threadId);
});

// Exportar la conexion para usarla en otros archivos

export default connection;


//RUTAS

app.get("/", authorization.soloPublico, (req, res) => res.sendFile(__dirname + "/pages/login.html"));
app.get("/register", authorization.soloPublico, (req, res) => res.sendFile(__dirname + "/pages/register.html"));
app.get("/admin", authorization.soloAdmin, (req, res) => res.sendFile(__dirname + "/pages/admin/admin.html"));
app.post("/api/login", authentication.login);
app.post("/api/register", authentication.register);
