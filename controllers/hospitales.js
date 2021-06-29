const { response } = require('express');
const Hospital = require('../models/hospital');
// res  pueden enviar una respuesta al cliente y terminar el ciclo de solicitud/respuestas. Si ninguno de estos métodos se invoca desde un manejador de rutas, la solicitud de cliente se dejará colgada.
const getHospitales = async(req, res = response) => {

    const hospitales = await Hospital.find().populate('usuario', 'nombre img');


    res.json({
        ok: true,
        hospitales
    });
}


const crearHospital = async(req, res = response) => {

    const uid = req.uid; // recuperamos el id porque este mismo se debe extraer desde el token
    const hospital = new Hospital({
        usuario: uid,
        ...req.body
    });

    try {

        const hospitalDB = await hospital.save();

        res.json({
            ok: true,
            hospital: hospitalDB
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const actualizarHospital = async(req, res = response) => {

    const id = req.params.id; // recuperar el id de la ruta
    const uid = req.uid; // tenemos acceso al uid, porque se paso por el JWT

    try {
        // obtener la referencia, para verificar que si existe un hospital con ese id
        const hospital = await Hospital.findById(id);
        // si no existe el hospital
        if (!hospital) {
            return res.status(404).json({
                ok: false,
                msg: 'Hospital no encontrado por id'
            });
        }

        // Si todo esta bien aqui se realiza la actualizacion
        // este es el nombre que debe de venir en la peticion

        const cambioHospital = {
            ...req.body,
            usuario: uid,
            // los tres puntos significa que ahi viene el nombre y el id, y etc
        }


        // GRABAR EN LA BD
        const hospitalActualizado = await Hospital.findByIdAndUpdate(id, cambioHospital, { new: true });
        // {{new: true}} - nos devuelve el ultimo elemento actualizado


        res.json({
            ok: true,
            hospital: hospitalActualizado
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }


}

const borrarHospital = async(req, res = response) => {


    const id = req.params.id; // recuperar el id de la ruta

    try {
        // obtener la referencia, para verificar que si existe un hospital con ese id
        const hospital = await Hospital.findById(id);
        // si no existe el hospital
        if (!hospital) {
            return res.status(404).json({
                ok: false,
                msg: 'Hospital no encontrado por id'
            });
        }

        // GRABAR EN LA BD
        await Hospital.findByIdAndDelete(id);


        res.json({
            ok: true,
            msg: 'Hospital borrado'
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}






// Exportaciones

module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}