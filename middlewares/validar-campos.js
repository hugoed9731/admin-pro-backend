const { response } = require('express');
const { validationResult } = require('express-validator');


const validarCampos = (req, res = response, next) => { // el next lo vamos a llamar si este middelware pasa
    // Ya paso por el middlelware y no hubo errores, tenemos en disponibilidad todos los errores pasador en mid
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({
            ok: false,
            errors: errores.mapped()
        });
    }

    // cuando llega a este punto significa que no hay errores por lo cual podemos llamar el next, osea que pase a lo siguiente

    next();
}

// Exportaciones

module.exports = {
    validarCampos
}