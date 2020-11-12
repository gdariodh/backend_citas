const express = require("express");
// endpoints
const router = express.Router();
const notaController = require("../controllers/notaController");
// librerias
const { check } = require("express-validator");
// middlewares
const auth = require("../middlewares/auth");

// TODO: rutas con sus verbos de /api/notas

/*
 TODO: Auth middleware estara en todos los verbos, porque son acciones que solo hacen los usuarios registrados, esto permite
 tener control de las acciones, auth lo que hace es extraer el token que esta en los headers de la req, y agrega el objeto
 del usuario autenticado en req.usuario, asi cada usuario tendra sus notas diferentes y autonomas.
 Y cada usuario solo podra manipular sus propias notas y no las de otros.
 */

// crea una nota
router.post(
  "/",
  [
    check("name", "El nombre de la nota es obligatorio").notEmpty()
  ],
  auth,
  notaController.newNota
);

// obtiene las notas de un usuario por id
router.get("/", auth, notaController.listNotas);

// eliminar una nota por id
router.delete("/:id", auth, notaController.deleteNota);

// editar una nota por su id
router.put("/:id", auth, notaController.updateNota);

module.exports = router;
