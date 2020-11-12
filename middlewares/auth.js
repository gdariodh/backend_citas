const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "variables.env" });

module.exports = (req, res, next) => {
  // TODO: extrae el token
  const authHeader = req.get("Authorization");

  if (authHeader) {
    // split sirve para separar, por defecto viene "Bearer 123". con split quedaria "123" que es el token
    const token = authHeader.split(" ")[1];
    try {
      // TODO: cuando verifica y es true, retorna el objeto del usuario que contiene su data como name,id, etc.
      const user = jwt.verify(token, process.env.SECRET_JWT);
      // agregamos user a la req, para enviar de forma oculta, para evitar manipulaciones.
      req.usuario = user;
      next();
    } catch (error) {
      console.log(error);
      res.status(401).json({ msg: "Acceso denegado, redirigiendo..." });
    }
  }
};
