const { response } = require('express');
const Medico = require('../models/medico');

// res  pueden enviar una respuesta al cliente y terminar el ciclo de solicitud/respuestas. Si ninguno de estos métodos se invoca desde un manejador de rutas, la solicitud de cliente se dejará colgada.
const getMedicos = async(req, res = response) => {

    const medicos = await Medico.find()
        .populate('usuario', 'nombre img')
        .populate('hospital', 'nombre img');


    res.json({
        ok: true,
        medicos
    });
}


const getMedicoById = async(req, res = response) => {

    // recuperamos id de medico
    const id = req.params.id;

    try {
        const medico = await Medico.findById(id)
            .populate('usuario', 'nombre img')
            .populate('hospital', 'nombre img');


        res.json({
            ok: true,
            medico
        });
    } catch (error) {
        console.log(error);
        res.json({
            ok: true,
            msg: 'Hable con el administrador'
        });
    }

}


const crearMedico = async(req, res = response) => {

    const uid = req.uid;
    const medico = new Medico({
        usuario: uid,
        ...req.body
    });

    try {

        const medicoDB = await medico.save();


        res.json({
            ok: true,
            medico: medicoDB
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }



}

const actualizarMedico = async(req, res = response) => {

    const id = req.params.id;
    const uid = req.uid;

    try {
        // verificar si existe el medico
        const medico = await Medico.findById(id);
        // si no existe el medico
        if (!medico) {
            return res.status(404).json({
                ok: false,
                msg: 'Médico no encontrado por id'
            });
        }

        // si todo esta bien, realiza la actualizacion
        const cambioMedico = {
            ...req.body,
            usuario: uid,
        }

        // SAVE IN THE BD

        const medicoActualizado = await Medico.findByIdAndUpdate(id, cambioMedico, { new: true });

        res.json({
            ok: true,
            medico: medicoActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }


}

const borrarMedico = async(req, res = response) => {
    const id = req.params.id; // recuperar el id de la ruta

    try {
        // obtener la referencia, para verificar que si existe un hospital con ese id
        const medico = await Medico.findById(id);
        // si no existe el hospital
        if (!medico) {
            return res.status(404).json({
                ok: false,
                msg: 'Médico no encontrado por id'
            });
        }

        // GRABAR EN LA BD
        await Medico.findByIdAndDelete(id);


        res.json({
            ok: true,
            msg: 'Médico borrado'
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
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico,
    getMedicoById
}