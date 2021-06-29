// Path: '/api/hospitales' - HOSPITALES

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

// importar controladores
const { getHospitales, crearHospital, actualizarHospital, borrarHospital } = require('../controllers/hospitales');

const router = Router();

// req - infomacion de los headers, que cliente fue
// res - lo que nosotros le vamos a responder al cliente 
router.get('/', getHospitales);

// crear usuario
router.post('/', [
    // aqui el id del usuario viene grabado en el JWT
    validarJWT,
    check('nombre', 'El nombre del hospital es necesario').not().isEmpty(),
    validarCampos

], crearHospital);


router.put('/:id', [

    validarJWT,
    check('nombre', 'El nombre del hospital es necesario').not().isEmpty(),
    validarCampos

], actualizarHospital);

router.delete('/:id', validarJWT, borrarHospital);




// exportamos el router
module.exports = router;