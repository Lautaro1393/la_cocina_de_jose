import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config(); // Agregar esto
import { usuarios } from "../controllers/authentication.controllers.js";



function soloAdmin(req, res, next) {
    const logueado = revisarCookie(req);
    if (logueado) return next();
    return res.redirect("/");

}

function soloPublico(req, res, next) {
    const logueado = revisarCookie(req);
    if (!logueado) return next();
    return res.redirect("/");
}
function revisarCookie(req) {
    try {
        const cookieJWT = req.headers.cookie.split("; ").find(cookie => cookie.startsWith("jwt=")).slice(4);
        const decodificada = jsonwebtoken.verify(cookieJWT, process.env.JWT_SECRET);
        console.log(decodificada);
        const usuarioAControlar = usuarios.find(usuario => usuario.user === decodificada.user);
        console.log(usuarioAControlar);
        if (!usuarioAControlar) {
            return false
        }
        return true;


    }
    catch {
        return false;
    }
}

export const methods = {
    soloAdmin,
    soloPublico
}