const { Schema, model } = require('mongoose');


const HospitalSchema = Schema({
    // esta es la definicion de los registros que van a estar dentro de una coleccion o tabla
    nombre: {
        type: String,
        required: true
    },

    img: {
        type: String,
    },

    usuario: {
        required: true, // no se debe de guardar ningun hospital sin el required
        type: Schema.Types.ObjectId,
        // esto le va indicar a moongose que va a haber una relacion con la siguiente referencia
        ref: 'Usuario'
    }
}, { collection: 'hospitales' });
// al agregar collection le indicamos que asi queremos que se guarde en la bd
// , la tabla, ya que la guarda en ingles, y con esto especificamos esp
HospitalSchema.method('toJSON', function() { // estos es una configuracion global, todos los metodos regresaran asi
    const { __v, ...object } = this.toObject(); // necesitamos la instancia del modelo actual ...Object -todo el resto del objeto

    return object;
});

// Implementacion del modelo

module.exports = model('Hospital', HospitalSchema);
// est modelo va a exponer este modelo, puede hace cosas como actualizar, borrar, e insertar usuarios