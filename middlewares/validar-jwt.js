// los middelware son como cualquier otro controlador, solo que tienen el metodo next
const jwt = require('jsonwebtoken');


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

// Exportacion

module.exports = {
    validarJWT
}