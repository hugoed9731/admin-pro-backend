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

const actualizarHospital = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'actualizarHospital'
    });
}

const borrarHospital = (req, res = response) => {
    res.json({
        ok: true,
        msg: 'borrarHospital'
    });
}






// Exportaciones

module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}