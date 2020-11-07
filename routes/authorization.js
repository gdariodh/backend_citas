const express = require("express");
// endpoints
const router = express.Router();
const authController = require("../controllers/authController");
// librerias
const { check } = require("express-validator");
// middlewares
const auth = require("../middlewares/auth");

// TODO: rutas con sus verbos de /api/auth

// le asigna un token o inicia sesion el usuario -> /api/usuarios/auth
router.post("/",
[
    check('email','El email es obligatorio').notEmpty().isEmail(),
    check('password','Password es obligatorio').notEmpty().isLength({min:6})
],
authController.userAuth);

// extrae el token asignado 
router.get("/", auth, authController.authUser);

// TODO: de esta forma exportamos todas las rutas para utilizarlo en el index.js con el endpoint /api/usuarios
module.exports = router;