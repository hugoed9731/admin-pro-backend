const { response } = require("express");
const bcryp = require('bcryptjs'); // libreria para encriptar contraseña
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/jwt");


const login = async(req, res = response) => {
    // VERIFICAR EMAIL
    const { email, password } = req.body; // recuperamos el email y el password
    try {

        // verificar que el usuario escribio un email correcto
        const usuarioDB = await Usuario.findOne({ email });

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            });
        }

        //  VERIFICAR CONTRASEÑA
        // compareSyn - compara la contraseña que se ingresa con la que esta en la BD,
        const validPassword = bcryp.compareSync(password, usuarioDB.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña no valida'
            });
        }

        // GENERAR TOKEN JWT - si es que pasa por los pasos anteriores
        const token = await generarJWT(usuarioDB.id);

        res.json({
            ok: true,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}


module.exports = {
    login
}