// Modelo
const Nota = require("../models/Nota");
// lee las variables de env
require("dotenv").config({ path: "variables.env" });
// TODO: Librerias
const { validationResult } = require("express-validator");

// TODO: Controllers

// crear una nota
exports.newNota = async (req, res) => {
  // revisar si hay un error en validaciones
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ errores: error.array() });
  }

  // TODO: si se ejecuta esto, paso la validacion

  // extraemos el id del usuario autenticado que nos entrega el middleware de Auth
  const userId = req.usuario.id;

  // creamos la nota
  const nota = new Nota(req.body);

  // agregamos el creador a la nota
  nota.author = userId;

  // almacenamos la nota
  try {
    await nota.save();
    res.json({nota:nota});
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un problema con el servidor" });
  }
};

// lista todas las notas de un usuario
exports.listNotas = async (req, res) => {
  const userId = req.usuario.id;
  try {
    // TODO: sort('-_id') para que me devuelva de la nota mas nueva a la mas vieja!
    const notas = await Nota.find({ author: userId }).sort('-_id')
    res.json({ notas });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un problema con el servidor" });
  }
};

// eliminar una nota
exports.deleteNota = async (req, res) => {
  const notaId = req.params.id;
  const userId = req.usuario.id;
  try {
    let nota = await Nota.findById(notaId);

    if (!nota) {
      return res.status(404).json({ msg: "La nota no existe" });
    }

    // TODO: .ToString porque author es un ObjectId

    // comparamos el id del creador con el id del usuario actual
    if (nota.author.toString() !== userId) {
      // si es diferente
      return res
        .status(401)
        .json({ msg: "Usuario no autorizado para eliminar la nota" });
    }

    // TODO: Si llega hasta aca es que si es el creador de la nota

    // elimina proyecto
    await Nota.findOneAndRemove({ _id: notaId });
    res.json({ msg: "La nota ha sido eliminada" });
  } catch (error) {
    console.log(error);
    res.json({ msg: "Hubo un problema con el servidor" });
  }
};

// editar una nota
exports.updateNota = async (req, res) => {
  /* TODO: extraemos el usuario autenticado que nos da "Auth", 
  los datos que pasan en el body, y el id de la nota a editar */
  const {
    body: { name, patient, description },
  } = req;
  const notaId = req.params.id;
  const userId = req.usuario.id;
  // buscamos la nota a editar
  let nota = await Nota.findOne({ _id: notaId });

  if (!nota) return res.status(404).json({ msg: "Nota no encontrada" });

  // comparamos el id del autor con el id del usuario actual, para ver si es el mismo.
  if (nota.author.toString() !== userId) {
    // si es diferente
    res.status(401).json({ msg: "Usuario no autorizado para editar la nota" });
  }

  // TODO: si pasa el if es que si es el creador de la nota

  // TODO: creamos un nuevo objeto para sustuirlo por la nota antigua
  const newNota = {};
  // agregamos los datos que vamos a actualizar
  newNota.name = name;
  newNota.patient = patient;
  newNota.description = description;

  // actualizamos la nota
  try {
    const notaActualizada = await Nota.findByIdAndUpdate(
      { _id: notaId },
      newNota,
      { new: true }
    );
    res.json({ notaActualizada });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un problema con el servidor" });
  }
};
