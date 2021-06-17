const { Schema, model } = require('mongoose');


const UsuarioSchema = Schema({
    // esta es la definicion de los registros que van a estar dentro de una coleccion o tabla
    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },

    img: {
        type: String,
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE'
    },
    google: {
        type: Boolean,
        default: false
    },
});

UsuarioSchema.method('toJSON', function() { // estos es una configuracion global, todos los metodos regresaran asi
    const { __v, _id, password, ...object } = this.toObject(); // necesitamos la instancia del modelo actual ...Object -todo el resto del objeto

    object.uid = _id;
    return object;
});

// Implementacion del modelo

module.exports = model('Usuario', UsuarioSchema);
// est modelo va a exponer este modelo, puede hace cosas como actualizar, borrar, e insertar usuarios