import jwt from 'jsonwebtoken';

// Middleware para permitir acceso solo a usuarios no autenticados (ej. páginas como login, registro, home)
function soloPublico(req, res, next) {
  const token = req.cookies.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, 'clave_secreta');
      // Redirigir dependiendo del rol del usuario
      if (decoded.rol === 'admin') {
        return res.redirect("/admin"); // Si es admin, redirigir al panel de administración
      } else {
        return res.redirect("/perfil"); // Si es un usuario común, redirigir a su perfil
      }
    } catch (err) {
      // Si el token no es válido, ignoramos y permitimos acceso a la página pública
    }
  }
  next();
}

// Middleware para permitir acceso a usuarios autenticados (común o admin)
function soloAutenticado(req, res, next) {
  const token = req.cookies.jwt;
  if (!token) {
    return res.redirect("/login"); // Si no está autenticado, redirigir al login
  }
  try {
    const decoded = jwt.verify(token, 'clave_secreta');
    req.user = decoded; // Añadir la información del usuario decodificado a la solicitud
    next();
  } catch (err) {
    res.status(400).send("Token inválido.");
  }
}

// Middleware para permitir solo acceso a usuarios con rol 'admin'
function soloAdmin(req, res, next) {
  const token = req.cookies.jwt;
  if (!token) {
    return res.redirect("/login"); // Si no tiene token, redirigir al login
  }
  try {
    const decoded = jwt.verify(token, 'clave_secreta');
    if (decoded.rol !== 'admin') {
      return res.status(403).send("Acceso denegado. No tienes permisos suficientes.");
    }
    req.user = decoded; // Añadir la información del usuario decodificado a la solicitud
    next();
  } catch (err) {
    res.status(400).send("Token inválido.");
  }
}

// Middleware para permitir solo acceso a usuarios con rol 'comun'
function soloUsuarios(req, res, next) {
  const token = req.cookies.jwt;
  if (!token) {
    return res.redirect("/login"); // Si no tiene token, redirigir al login
  }
  try {
    const decoded = jwt.verify(token, 'clave_secreta');
    if (decoded.rol !== 'comun') {
      return res.status(403).send("Acceso denegado. No tienes permisos suficientes.");
    }
    req.user = decoded; // Añadir la información del usuario decodificado a la solicitud
    next();
  } catch (err) {
    res.status(400).send("Token inválido.");
  }
}

// Exportar los métodos
export const methods = {
  soloPublico,
  soloAutenticado,
  soloAdmin,
  soloUsuarios,
};
