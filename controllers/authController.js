// Modelo
const User = require("../models/User");
// lee las variables de env
require("dotenv").config({ path: "variables.env" });
// TODO: Librerias
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

// TODO: autentica el usuario
exports.userAuth = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ errores: error.array() });
  }

  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(401).json({ msg: "El usuario no existe" });
    return next();
  }

  if (bcrypt.compareSync(password, user.password)) {
    const newToken = jwt.sign(
      {
        nombre: user.name,
        lastname: user.lastname,
        id: user.id,
      },
      process.env.SECRET_JWT,
      {
        expiresIn: "9h",
      }
    );

    res.json({ token: newToken, msg: `Bienvenido ${user.name}` });
  } else {
    res.status(401).json({ msg: "Password incorrecto" });
    return next();
  }
};

// TODO: extrae y retorna el objeto de usuario que proporciona el middleware "Auth" mediante req.usuario
exports.authUser = (req, res) => {
  if(req.usuario){
    res.json({ usuario: req.usuario });
  }
  
};
