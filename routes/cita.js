const express = require("express");
// endpoints
const router = express.Router();
const citaController = require("../controllers/citaController");
// librerias
const { check } = require("express-validator");
// middlewares
const auth = require("../middlewares/auth");

// TODO: rutas con sus verbos de /api/citas

/*
 TODO: Auth middleware estara en todos los verbos, porque son acciones que solo hacen los usuarios registrados, esto permite
 tener control de las acciones, auth lo que hace es extraer el token que esta en los headers de la req, y agrega el objeto
 del usuario autenticado en req.usuario, asi cada usuario tendra sus citas diferentes y autonomas.
 Y cada usuario solo podra manipular sus propias citas y no las de otros.
 */

// crea una cita
router.post(
  "/",
  [
    check("name", "El nombre de la cita es obligatorio").notEmpty(),
    check("patient", "El nombre del paciente es obligatorio").notEmpty(),
  ],
  auth,
  citaController.newCita
);

// obtiene las citas de un usuario por id
router.get("/", auth, citaController.listCitas);

// eliminar una cita por id
router.delete("/:id", auth, citaController.deleteCita);

// editar una cita por su id
router.put("/:id", auth, citaController.updateCita);

module.exports = router;
