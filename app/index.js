// IMPORTACION DE DEPENDENCIAS

import express from "express";

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


//RUTAS

app.get("/", authorization.soloPublico, (req, res) => res.sendFile(__dirname + "/pages/login.html"));
app.get("/register", authorization.soloPublico, (req, res) => res.sendFile(__dirname + "/pages/register.html"));
app.get("/admin", authorization.soloAdmin, (req, res) => res.sendFile(__dirname + "/pages/admin/admin.html"));
app.post("/api/login", authentication.login);
app.post("/api/register", authentication.register);
