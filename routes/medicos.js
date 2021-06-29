// Medicos - ruta: '/api/medicos'

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

// importar controladores
const { getMedicos, crearMedico, actualizarMedico, borrarMedico } = require('../controllers/medicos');

const router = Router();

// req - infomacion de los headers, que cliente fue
// res - lo que nosotros le vamos a responder al cliente 
router.get('/', getMedicos);

// crear usuario
router.post('/', [

    validarJWT,
    check('nombre', 'El nombre del medico es necesario').not().isEmpty(),
    check('hospital', 'El hospital id debe de ser válido').isMongoId(),
    // isMongoId() - validamos que el id sea valido, que cumpla con lo que solicita mongo
    validarCampos

], crearMedico);


router.put('/:id', [

    validarJWT,
    check('nombre', 'El nombre del medico es necesario').not().isEmpty(),
    check('hospital', 'El hospital id debe de ser válido').isMongoId(),
    validarCampos

], validarJWT, actualizarMedico);

router.delete('/:id', validarJWT, borrarMedico);




// exportamos el router
module.exports = router;