// Modelo
const Cita = require("../models/Cita");
// lee las variables de env
require("dotenv").config({ path: "variables.env" });
// TODO: Librerias
const { validationResult } = require("express-validator");

// TODO: Controllers

// crear una cita
exports.newCita = async (req, res) => {
  // revisar si hay un error en validaciones
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ errores: error.array() });
  }

  // TODO: si se ejecuta esto, paso la validacion

  // extraemos el id del usuario autenticado que nos entrega el middleware de Auth
  const userId = req.usuario.id;

  // creamos la cita
  const cita = new Cita(req.body);

  // agregamos el creador a la cita
  cita.author = userId;

  // almacenamos la cita
  try {
    await cita.save();
    res.json(cita);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un problema con el servidor" });
  }
};

// lista todas las citas de un usuario
exports.listCitas = async (req, res) => {
  const userId = req.usuario.id;
  try {
    const proyectos = await Cita.find({ author: userId }).sort({ date: -1 });
    res.json({ proyectos });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un problema con el servidor" });
  }
};

// eliminar un proyecto
exports.deleteCita = async (req, res) => {
  const citaId = req.params.id;
  const userId = req.usuario.id;
  try {
    let cita = await Cita.findById(citaId);

    if (!cita) {
      return res.status(404).json({ msg: "La cita no existe" });
    }

    // TODO: .ToString porque author es un ObjectId

    // comparamos el id del creador con el id del usuario actual
    if (cita.author.toString() !== userId) {
      // si es diferente
      return res
        .status(401)
        .json({ msg: "Usuario no autorizado para eliminar la cita" });
    }

    // TODO: Si llega hasta aca es que si es el creador de la cita

    // elimina proyecto
    await Cita.findOneAndRemove({ _id: citaId });
    res.json({ msg: "La cita ha sido eliminada" });
  } catch (error) {
    console.log(error);
    res.json({ msg: "Hubo un problema con el servidor" });
  }
};

// editar una cita
exports.updateCita = async (req, res) => {
  /* TODO: extraemos el usuario autenticado que nos da "Auth", 
  los datos que pasan en el body, y el id de la cita a editar */
  const {
    body: { name, patient, description },
  } = req;
  const citaId = req.params.id;
  const userId = req.usuario.id;
  // buscamos la cita a editar
  let cita = await Cita.findOne({ _id: citaId });

  if (!cita) return res.status(404).json({ msg: "Cita no encontrada" });

  // comparamos el id del autor con el id del usuario actual, para ver si es el mismo.
  if (cita.author.toString() !== userId) {
    // si es diferente
    res.status(401).json({ msg: "Usuario no autorizado para editar la cita" });
  }

  // TODO: si pasa el if es que si es el creador de la cita

  // TODO: creamos un nuevo objeto para sustuirlo por la cita antigua
  const newCita = {};
  // agregamos los datos que vamos a actualizar
  newCita.name = name;
  newCita.patient = patient;
  newCita.description = description;

  // actualizamos la cita
  try {
    const citaActualizada = await Cita.findByIdAndUpdate(
      { _id: citaId },
      newCita,
      { new: true }
    );
    res.json({ citaActualizada });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un problema con el servidor" });
  }
};
