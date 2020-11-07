// Modelo
const User = require("../models/User");
// lee las variables de env
require("dotenv").config({ path: "variables.env" });
// TODO: Librerias
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

// TODO: Controllers
exports.newUser = async (req, res) => {
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
    res.json({ msg: "Usuario creado", usuario: user });
  } catch (error) {
    console.log(error);
    res
      .json(500)
      .json({ msg: "Hubo un problema con el servidor, intentalo de nuevo" });
  }
};

