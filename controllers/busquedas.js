// getTodo
const { response } = require('express');
const Usuario = require('../models/usuario');
const Hospital = require('../models/hospital');
const Medico = require('../models/medico');


const getTodo = async(req, res = response) => { // esto es el controlador cuando se haga la peticion a la ruta de usuarios


    const busqueda = req.params.busqueda; // recuperamos el uid que viene como parte del url

    const regex = new RegExp(busqueda, 'i'); // declaramos expresion regular para la busqueda. i - significa busquedaInsensible

    // REALIZAR BUSQUEDA DE LO SOLICITADO - que no sea escribir el dato exacto 


    // esto se puede hace con await, pero tardari tres veces mas, es mas agil de esta manera
    const [usuarios, medicos, hospitales] = await Promise.all([
        Usuario.find({ nombre: regex }),
        Medico.find({ nombre: regex }),
        Hospital.find({ nombre: regex }),

    ]);


    try {
        res.json({
            ok: true,
            usuarios,
            medicos,
            hospitales

        });

    } catch (error) {
        res.json({
            ok: false,
            msg: 'nada'
        });
    }


}

// BUSQUEDAS POR UNA COLECCION ESPECIFICA
const getDocumentosColeccion = async(req, res = response) => { // esto es el controlador cuando se haga la peticion a la ruta de usuarios


    const tabla = req.params.tabla; // recuperamos el uid que viene como parte del url
    const busqueda = req.params.busqueda;
    const regex = new RegExp(busqueda, 'i'); // declaramos expresion regular para la busqueda. i - significa busquedaInsensible

    let data = [];

    switch (tabla) {
        case 'medicos':
            data = await Medico.find({ nombre: regex })
                .populate('usuario', 'nombre img')
                .populate('hospital', 'nombre img');


            break;
        case 'hospitales':
            data = await Hospital.find({ nombre: regex })
                .populate('usuario', 'nombre img');


            break;

        case 'usuarios':
            data = await Usuario.find({ nombre: regex });

            break;

        default:
            return res.status(400).json({
                ok: false,
                msg: 'La tabla tiene que ser usuarios/medicos/hospitales'
            });


    }

    res.json({
        ok: true,
        resultados: data
            // es una busqueda y aqui tendremos los "resultados de la busqueda"
    });


}

// exportaciones para poder usar los const fuera de este archivo
module.exports = {
    getTodo,
    getDocumentosColeccion
}