const mongoose = require('mongoose');

require("dotenv").config({
    path:"variables.env"
});

const connectDB = async () => {
    try {
     await mongoose.connect(process.env.DB_URL,{
         useNewUrlParser:true,
         useUnifiedTopology:true,
         useFindAndModify:false,
         useCreateIndex:true
     });
     console.log("DB conectada con el servidor exitosamente:)")   
    } catch (error) {
        console.log("Hubo error en al conectar con la DB", error);
        // detiene el servidor 
        process.exit(1)
    }
}

// TODO: Todos los datos se almacenaran en CitasDB que es como se llama la DB de mongoAtlas

module.exports = connectDB;