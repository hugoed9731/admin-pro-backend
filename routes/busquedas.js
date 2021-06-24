// path : api/todo/:busqueda


const { Router } = require('express');
const { getTodo, getDocumentosColeccion } = require('../controllers/busquedas');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

// validacion de token
router.get('/:busqueda', validarJWT, getTodo);
router.get('/coleccion/:tabla/:busqueda', validarJWT, getDocumentosColeccion);




// exportamos el router
module.exports = router;