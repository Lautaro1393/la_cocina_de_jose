
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const usuarios = [{
    user: "admin2",
    email: "admin2@gmail.com",
    password: "$2a$05$9hoQSuvQiKjwzXqozyqarucapIfE3bygPC1i/Vposy6ndQKGMkXeS"
}]


async function login(req, res) {
    console.log(req.body);
    const user = req.body.user;
    const password = req.body.password;

    if (!user || !password) {
        // console.log("Ingreso");
        return res.status(400).send({ status: "Error", message: "Los campos estan incompletos" });
    }
    const usuarioAControlar = usuarios.find(usuario => usuario.user === user);
    if (!usuarioAControlar) {
        return res.status(400).send({ status: "Error", message: "Error durante el login" });
    }
    const loginCorrecto = await bcryptjs.compare(password, usuarioAControlar.password);

    console.log(loginCorrecto);

    if (!loginCorrecto) {
        return res.status(400).send({ status: "Error", message: "Error durante el login" })
    }
    const token = jsonwebtoken.sign(
        { user: usuarioAControlar.user },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION }
    );
    const cookieOption = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
        // convierto en dias , guarde un dia que es el valor que esta en la variable de entorno 
        path: "/"
    }

    res.cookie("jwt", token, cookieOption); // generamos la cookie
    res.send({ status: "OK", message: "Usuario logueado", redirect: "/admin" });
    // return res.json({ redirect: "/admin" });
}

async function register(req, res) {
    console.log(req.body);
    const user = req.body.user;
    const password = req.body.password;
    const email = req.body.email;
    if (!user || !password || !email) {
        // console.log("Ingreso");
        return res.status(400).send({ status: "Error", message: "Los campos estan incompletos" });
    }
    const usuarioAControlar = usuarios.find(usuario => usuario.user === user);
    if (usuarioAControlar) {
        return res.status(400).send({ status: "Error", message: "Este usuario ya existe" });
    }
    const salt = await bcryptjs.genSalt(5);
    const hashPassword = await bcryptjs.hash(password, salt);
    const nuevoUsuario = {
        user, email, password: hashPassword
    }
    usuarios.push(nuevoUsuario);
    console.log(usuarios);
    return res.status(201).send({ status: "ok", message: `Usuario ${nuevoUsuario} agregado`, redirect: "/" });

}





export const methods = {
    login,
    register
}