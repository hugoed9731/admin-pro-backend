const { Schema, model } = require('mongoose');


const MedicoSchema = Schema({
    // esta es la definicion de los registros que van a estar dentro de una coleccion o tabla
    nombre: {
        type: String,
        required: true
    },

    img: {
        type: String,
    },
    usuario: {
        type: Schema.Types.ObjectId,
        // esto le va indicar a moongose que va a haber una relacion con la siguiente referencia
        ref: 'Usuario',
        required: true
    },

    hospital: {
        type: Schema.Types.ObjectId,
        // esto le va indicar a moongose que va a haber una relacion con la siguiente referencia
        ref: 'Hospital',
        required: true
    }
});

MedicoSchema.method('toJSON', function() { // estos es una configuracion global, todos los metodos regresaran asi
    const { __v, ...object } = this.toObject(); // necesitamos la instancia del modelo actual ...Object -todo el resto del objeto

    return object;
});

// Implementacion del modelo

module.exports = model('Medico', MedicoSchema);
// est modelo va a exponer este modelo, puede hace cosas como actualizar, borrar, e insertar usuarios