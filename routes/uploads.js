// path : api/uploads/usuarios/id


const { Router } = require('express');
const expressFileUpload = require('express-fileupload'); // es un middelware de express-fileupload
const { fileUpload, retornaImagen } = require('../controllers/uploads');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.use(expressFileUpload()); // es un middelware con la configuracion por defecto

// validacion de token
router.put('/:tipo/:id', validarJWT, fileUpload);

router.get('/:tipo/:foto', retornaImagen);





// exportamos el router
module.exports = router;