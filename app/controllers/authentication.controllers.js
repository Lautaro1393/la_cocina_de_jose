import bcryptjs from 'bcryptjs';
import connection from '../index.js';
import jwt from 'jsonwebtoken';

// Función de Register
async function register(req, res) {
  const { user, password, email, rol } = req.body;

  // Validar que se envían todos los campos requeridos
  if (!user || !password || !email) {
    return res.status(400).send({ status: "Error", message: "Los campos están incompletos" });
  }

  // Verificar si el usuario ya existe en la base de datos
  connection.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ status: "Error", message: "Error del servidor" });
    }

    if (results.length > 0) {
      return res.status(400).send({ status: "Error", message: "Este usuario ya existe" });
    } else {
      // Encriptar la contraseña
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(password, salt);

      // Determinar el rol: si no se proporciona, por defecto será 'comun'
      const userRole = rol ? rol : 'comun';

      // Insertar el nuevo usuario en la base de datos
      connection.query(
        'INSERT INTO usuarios (nombre, email, contraseña, rol) VALUES (?, ?, ?, ?)',
        [user, email, hashedPassword, userRole],
        (err, results) => {
          if (err) {
            console.error(err);
            return res.status(500).send({ status: "Error", message: "Error al registrar usuario" });
          }

          return res.status(201).send({ status: "ok", message: `Usuario ${user} agregado correctamente`, redirect: "/" });
        }
      );
    }
  });
}

// Función de Login
async function login(req, res) {
  const { identifier, password } = req.body;

  if (!identifier  || !password) {
    return res.status(400).send({ status: "Error", message: "Los campos están incompletos" });
  }

  // Buscar el usuario en la base de datos
  connection.query('SELECT * FROM usuarios WHERE email = ? OR nombre = ?', [identifier, identifier], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send({ status: "Error", message: "Error del servidor" });
    }

    if (results.length === 0) {
      return res.status(400).send({ status: "Error", message: "El usuario no existe" });
    }

    const usuario = results[0];
    const isPasswordCorrect = await bcryptjs.compare(password, usuario.contraseña);

    if (!isPasswordCorrect) {
      return res.status(400).send({ status: "Error", message: "Contraseña incorrecta" });
    }

    // Crear el token JWT
    const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, 'clave_secreta', { expiresIn: '1h' });

    // Enviar el token como cookie
    res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 }); // 1 hora de duración
     // Redirección basada en el rol del usuario
     const redirectUrl = usuario.rol === 'admin' ? '/admin' : '/perfil';
     return res.status(200).send({ status: "ok", message: "Login exitoso", redirect: redirectUrl });
  });
}

export const methods = {
  register,
  login
};
