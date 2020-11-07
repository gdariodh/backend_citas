const express = require("express");

const app = express();

const cors = require("cors");

const port = process.env.PORT || 6000;

const connectDB = require("./config/db");

// para leer los datos a la request por el body
app.use(express.json());

// permitir las peticiones al servidor desde otro host
const configCors = {
  origin: process.env.FRONTEND_URL,
};
app.use(cors(configCors));

// establece la conexion con la DB de mongoAtlas
connectDB();

// TODO: Endpoints
app.use("/api/usuarios", require("./routes/user"));
app.use("/api/auth", require("./routes/authorization"));
app.use("/api/citas", require("./routes/cita"))

// activa la aplicacion - Backend App
app.listen(port, "0.0.0.0", () => {
  console.log(`Servidor de desarrollo corriendo en http://localhost:${port}`);
});
