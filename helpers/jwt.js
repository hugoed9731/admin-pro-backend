const jwt = require('jsonwebtoken');



const generarJWT = (uid) => {
    // vamos a transformar el generarJWT en un promesa, para poder utilizar el await en otro lado

    return new Promise((resolve, reject) => {
        const payload = { // en el payload podemos guardar lo que queramos siempre y cuando no sea informacion sensible

            uid,
        };

        jwt.sign(payload, process.env.JWT_SECRET, {
            //el primer argumento lleva la firma del token que esta en env
            //  el segundo argumento es la duracion del toquen
            expiresIn: '12h'
        }, (err, token) => {

            if (err) {
                console.log(err);
                reject('No se pudo generar el JWT');
            } else {
                resolve(token);
            }

        });
    });

}

// Exportacioes

module.exports = {
    generarJWT,
}