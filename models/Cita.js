const mongoose = require("mongoose");

const citaSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  patient: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  description: {
    type: String,
    trim: true,
  },
  state: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Cita", citaSchema);
