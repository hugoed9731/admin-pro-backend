// los middelware son como cualquier otro controlador, solo que tienen el metodo next
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = (req, res, next) => {
    // Leer el token
    const token = req.header('x-token');

    // VALIDACIONES DEL TOKEN
    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la peticion'
        });
    }

    try {

        const { uid } = jwt.verify(token, process.env.JWT_SECRET);

        req.uid = uid;


        // next - se llama si todo sale correctamente
        next();

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no valido'
        });
    }
}

const validarADMIN_ROLE = async(req, res, next) => {
    // req.uid - lo establecimos arria asi que lo podemos utilizar
    const uid = req.uid;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no existe'
            });
        }

        // si esto sigue es que si tenemos un usuario en la bd
        if (usuarioDB.role !== 'ADMIN_ROLE') {
            // no es administrador
            return res.status(403).json({
                ok: false,
                msg: 'No tiene privilegios de administrador'
            });
        }
        // si logra pasar las validaciones llamaos al next
        next();

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const validarADMIN_ROLE_o_MismoUsuario = async(req, res, next) => {
        // req.uid - lo establecimos arria asi que lo podemos utilizar
        const uid = req.uid;
        const id = req.params.id;
        // si estos dos son iguales, es un usuario actualizandose a si mismo

        try {

            const usuarioDB = await Usuario.findById(uid);

            if (!usuarioDB) {
                return res.status(404).json({
                    ok: false,
                    msg: 'Usuario no existe'
                });
            }

            // si esto sigue es que si tenemos un usuario en la bd
            // || uid === id - el usuario tiene que ser administrador y que los id sean iguales
            if (usuarioDB.role === 'ADMIN_ROLE' || uid === id) {
                // si logra pasar las validaciones llamaos al next
                next();
            } else {
                // no es administrador
                return res.status(403).json({
                    ok: false,
                    msg: 'No tiene privilegios de administrador'
                });
            }


        } catch (error) {
            console.log(error);
            res.status(500).json({
                ok: false,
                msg: 'Hable con el administrador'
            });
        }
    }
    // Exportacion

module.exports = {
    validarJWT,
    validarADMIN_ROLE,
    validarADMIN_ROLE_o_MismoUsuario
}