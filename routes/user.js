const express = require("express");
// endpoints
const router = express.Router();
const userController = require("../controllers/userController");
// librerias
const { check } = require("express-validator");
// middlewares
const auth = require("../middlewares/auth");

// TODO: rutas con sus verbos de /api/usuarios

router.post(
  "/",
  [
    check("name", "Agrega un nombre").notEmpty(),
    check("lastname", "Agrega un apellido").notEmpty(),
    check("email", "Email es obligatorio").notEmpty().isEmail(),
    check("password", "Password debe tener al menos 6 caracteres")
      .notEmpty()
      .isLength({ min: 6 }),
  ],
  userController.newUser
);

// TODO: de esta forma exportamos todas las rutas para utilizarlo en el index.js con el endpoint /api/usuarios
module.exports = router;
