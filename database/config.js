const mongoose = require('mongoose');
// funcion que va establecer la conexion entre node y mongo
// const mongoose = require('mongoose');
const dbConnection = async() => {

    try {
        // await - espera a que tod ese codigo pase
        await mongoose.connect(process.env.DB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });

        console.log('DB online');

    } catch (error) {
        console.log(error);
        throw new Error('Error al iniciar la base de datos');
    }


}

// exportar la funcion de conexion para poder usarlar
module.exports = {
    dbConnection
}