// Modelo
const User = require("../models/User");
// lee las variables de env
require("dotenv").config({ path: "variables.env" });
// TODO: Librerias
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
// TODO: Controllers
exports.newUser = async (req, res, next) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ errores: error.array() });
  }

  // revisar si ya esta registrado
  const { email, password } = req.body;
  // compara el email, si existe retorna un status 400
  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ msg: "Email registrado, intenta con otro" });
  }

  // TODO: creamos usuario
  user = new User(req.body);
  // Hash del password
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  // agregamos el nuevo password con hash al usuario creado
  user.password = hash;

  try {
    // TODO: almacenamos el nuevo usuario en la DB
    await user.save();

    // Ya como el usuario esta almacenado en la DB, le asignamos un token para que inicie sesion
    if (user) {
      const newToken = jwt.sign(
        {
          nombre: user.name,
          lastname: user.lastname,
          id: user.id,
        },
        process.env.SECRET_JWT,
        {
          // TODO: cuando expira el token, ya termina la sesion
          expiresIn: "9h",
        }
      );

      res.json({ msg: "Usuario creado exitosamente", token: newToken });
    } else {
      res.status(401).json({ msg: "Password incorrecto" });
      return next();
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ msg: "Hubo un problema con el servidor, intentalo de nuevo" });
  }
};
