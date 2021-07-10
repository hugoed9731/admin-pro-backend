const { response } = require("express");
const bcryp = require('bcryptjs'); // libreria para encriptar contraseña
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/jwt");
const { googleVerify } = require("../helpers/google-verify");


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


const googleSignIn = async(req, res = response) => {

    const googleToken = req.body.token;


    try {


        const { name, email, picture } = await googleVerify(googleToken);

        // verificar si ya existe un usuario en la bd con ese email
        const usuarioDB = await Usuario.findOne({ email });
        let usuario;
        if (!usuarioDB) {
            // si el usuario no existe vamos a crear uno nuevo
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            });
        } else {
            // pero si existe
            usuario = usuarioDB;
            usuario.google = true;
        }
        // GUARDAR EN LA BD

        await usuario.save();

        // GENERAR TOKEN JWT - si es que pasa por los pasos anteriores
        const token = await generarJWT(usuario.id);



        res.json({
            ok: true,
            token
        });
    } catch (error) {
        res.status(401).json({
            ok: false,
            msg: 'Token no es correcto'
        });
    }
}

// Renovar TOKEN- esto significa que ya tenemos el uid del usuario
const renewToken = async(req, res = response) => {

    const uid = req.uid;

    // GENERAR TOKEN JWT - si es que pasa por los pasos anteriores
    const token = await generarJWT(uid); // este es el token nuevo

    // Obtener el usuario por uid
    const usuario = await Usuario.findById(uid);


    res.json({
        ok: true,
        token,
        usuario
        // este es el token nuevo que regresamos
    });
}


module.exports = {
    login,
    googleSignIn,
    renewToken
}