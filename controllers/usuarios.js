const { response } = require('express');
const bcryp = require('bcryptjs'); // libreria para encriptar contraseña
const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/jwt");

// Aqui va a haber funciones que yo voy a exportar
// Aqui tenemos la logica que va a hacer cada una de mis rutas

const getUsuarios = async(req, res) => { // esto es el controlador cuando se haga la peticion a la ruta de usuarios

        // PAGINACION 
        // si no manda numero que utilice el 0
        const desde = Number(req.query.desde) || 0;
        console.log(desde);


        // Lo que esta dentro de [] es destructuracion del arreglo, para obtener datos
        const [usuarios, total] = await Promise.all([ //esto es una coleccion de promesas
            // ejecuta todas estas promesas
            Usuario //esta es la primero promesa
            .find({}, 'nombre email role google img') // {} especificamos un filtro
            .skip(desde) //que se salte los registros apartir del desde o lo que contenga
            .limit(5), //cuantosregistros se quieren obtener desde esa posicion

            Usuario.countDocuments() //segundo valor de la promesa
        ]);

        res.json({
            ok: true,
            usuarios,
            total
        });
    }
    // req - esta la peticion del usuario
const crearUsuario = async(req, res = response) => {

    const { email, password } = req.body;


    try {
        const existeEmail = await Usuario.findOne({ email });

        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya esta registrado',
            });
        }

        // creamos nueva instancia de usuario
        const usuario = new Usuario(req.body);

        // Encriptar contraseña  - salt es un numero aleatorio
        const salt = bcryp.genSaltSync();
        usuario.password = bcryp.hashSync(password, salt);

        // Guardamos usuario
        await usuario.save(); // lo guardamos en la BD


        // GENERAR TOKEN JWT - si es que pasa por los pasos anteriores
        const token = await generarJWT(usuario.id);


        res.json({
            ok: true,
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        });
    }
}


// Actualizar usuario

const actualizarUsuario = async(req, res = response) => {

    // TODO: Validar token y comprobar si es el usuario correcto


    // uid que viene como parte del url
    const uid = req.params.id; // recuperamos el uid que viene como parte del url
    try {
        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }

        // Actualizaciones
        // borramos informacion que es obligatoria por moongose, si no hacemos esto se actualizaria
        // de estos campos podemos borrar los que no queremos actualizar
        const { password, google, email, ...campos } = req.body;

        if (usuarioDB.email !== email) {

            // la persona quiere cambiar el email por otro - verificar que la contraseña no este cambiando
            //    validamos que al querer cambiar el email este no exista en la bd si no manda un error
            const existeEmail = await Usuario.findOne({ email });
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }

        }
        // esto solo debe de funcionar si no es de un usuario de google
        if (!usuarioDB.google) {
            campos.email = email;
        } else if (usuarioDB.email !== email) {
            return res.status(200).json({
                ok: false,
                msg: 'Usuario de google no puede cambiar su correo'
            });
        }
        campos.email = email;
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true }); // new: true - que moongose no nos regrese versiones pasadas antes de la actualizacion
        // evitamos actualizar la informacion que viene dentro de los campos

        res.json({
            ok: true,
            usuario: usuarioActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
}


const borrarUsuario = async(req, res = response) => {

    const uid = req.params.id; // recuperamos el id desde req
    try {
        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }

        // si existe el usuario
        await Usuario.findByIdAndDelete(uid);

        res.json({
            ok: true,
            msg: 'Usuario eliminado'
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}


// exportaciones para poder usar los const fuera de este archivo
module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}