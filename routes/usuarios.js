// Ruta: /api/usuarios
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { getUsuarios, crearUsuario, actualizarUsuario, borrarUsuario } = require('../controllers/usuarios');
const { validarJWT, validarADMIN_ROLE, validarADMIN_ROLE_o_MismoUsuario } = require('../middlewares/validar-jwt');

const router = Router();

// req - infomacion de los headers, que cliente fue
// res - lo que nosotros le vamos a responder al cliente 
router.get('/', validarJWT, getUsuarios);

// crear usuario
router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    validarCampos, // siempre se debe de llamar despues de los check, porque asi funciona


], crearUsuario);


router.put('/:id', [
    validarJWT,
    validarADMIN_ROLE_o_MismoUsuario,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('role', 'El role es obligatorio').not().isEmpty(),
    validarCampos
], actualizarUsuario);

router.delete('/:id', [validarJWT, validarADMIN_ROLE], borrarUsuario);




// exportamos el router
module.exports = router;