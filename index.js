require('dotenv').config(); // leé las variables de entorno que pongamos en .env
const express = require('express');
const cors = require('cors'); // usamos cors para permitir peticiones de cualquier servidor
const { dbConnection } = require('./database/config');


// Crear el servidor express, o inicializa la app
const app = express();

// Configurar CORS
app.use(cors()); // use es un middelware, es un funcion que se va a ejecutar siempre hacia abajo

// Lectura de body y parseo  - middleware
app.use(express.json());

// Base de datos 
dbConnection();
console.log(process.env);

// Rutas
// Acceder a la ruta desde aqui
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/login', require('./routes/auth'));

// levantar servidor
app.listen(process.env.PORT, () => {
    console.log(' Servidor corriendo en puerto' + process.env.PORT);
});


// fVvlH71tnOeqDDg8
// mean_user