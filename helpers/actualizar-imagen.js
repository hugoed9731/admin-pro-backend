const fs = require('fs'); // paquete de node - filesystem

const Usuario = require('../models/usuario');
const Medico = require('../models/medico');
const Hospital = require('../models/hospital');

const borrarImagen = (path) => {

    // verificar si existe este path
    if (fs.existsSync(path)) { //existsSyn - lo hace sincrono
        fs.unlinkSync(path); // si existe vamos a borrarlo , osea borramos la imagen 
    }

}


const actualizarImagen = async(tipo, id, nombreArchivo) => {

    let pathViejo = '';
    // ver que tipo de informacion es
    switch (tipo) {
        case 'medicos':
            const medico = await Medico.findById(id);
            // verificar si esto existe
            if (!medico) {
                console.log('No es un médico por id');
                return false;
            }

            // evaluar si el médico tiene una imagen previa, si es que si hay que eliminarla
            pathViejo = `./uploads/medicos/${ medico.img }`;
            borrarImagen(pathViejo);

            medico.img = nombreArchivo;
            // GRABEMOS EL MEDICO
            await medico.save();
            return true;
            break;

        case 'hospitales':

            const hospital = await Hospital.findById(id);
            // verificar si esto existe
            if (!hospital) {
                console.log('No es un hospital por id');
                return false;
            }

            // evaluar si el médico tiene una imagen previa, si es que si hay que eliminarla
            pathViejo = `./uploads/hospitales/${ hospital.img }`;
            borrarImagen(pathViejo);

            hospital.img = nombreArchivo;
            // GRABEMOS EL MEDICO
            await hospital.save();
            return true;
            break;

        case 'usuarios':

            const usuario = await Usuario.findById(id);
            // verificar si esto existe
            if (!usuario) {
                console.log('No es un usuario por id');
                return false;
            }

            // evaluar si el médico tiene una imagen previa, si es que si hay que eliminarla
            pathViejo = `./uploads/usuarios/${ usuario.img }`;
            borrarImagen(pathViejo);

            usuario.img = nombreArchivo;
            // GRABEMOS EL MEDICO
            await usuario.save();
            return true;

            break;
    }
}



module.exports = {
    actualizarImagen
}