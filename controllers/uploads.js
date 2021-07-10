const path = require('path'); // esto viene de node
const fs = require('fs');
const { response } = require("express");
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require("../helpers/actualizar-imagen");




const fileUpload = (req, res = response) => {

    const tipo = req.params.tipo; //recuperamos el id como argumento de la URL
    const id = req.params.id;

    // validar tipo
    const tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            msg: 'No es un médico, usuario u hospital (tipo)'
        });
    }
    // Validacion de express-fileuploads - VALIDAR QUE EXISTA UN ARCHIVO
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay ningun archivo'
        });
    }

    // Procesar la imagen...
    const file = req.files.imagen; // obtenemos la imagen

    const nombreCortado = file.name.split('.'); //hugo.1.2.jpg - esto se alcenara en un arreglo cada campo antes del punto
    const extensionArchivo = nombreCortado[nombreCortado.length - 1]; // con esto ya obtenemos la extension de archivo .jpg.pdf.raw

    // Validar Extension
    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];
    if (!extensionesValidas.includes(extensionArchivo)) {
        // si no esta ahí
        return res.status(400).json({
            ok: false,
            msg: 'No es una extension permitida'
        });
    }

    // Generar el nombre del archivo - asignaremos el nombre del archivo con uuid
    const nombreArchivo = `${ uuidv4() }.${extensionArchivo}`; // recuperamos la extension de ese archivo gracias a $extensionArchivo

    // Path para guardar la imagen - ruta
    const path = `./uploads/${tipo}/${nombreArchivo}`;

    // Mover imagen- este código viene de npm-upload files/ examples
    file.mv(path, (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                ok: false,
                msg: 'Error al mover la imagen'
            });
        }



        // Actualizar BD
        actualizarImagen(tipo, id, nombreArchivo);


        res.json({
            ok: true,
            msg: 'Archivo subido',
            nombreArchivo
        });
    });
}


// mostrar la imagen
const retornaImagen = (req, res = response) => {
    const tipo = req.params.tipo; //recuperamos el id como argumento de la URL
    const foto = req.params.foto; //recuperamos el id como argumento de la URL

    const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`); // ubicacion de la imagen

    // imagen por defecto
    if (fs.existsSync(pathImg)) {
        // responde una imagen
        res.sendFile(pathImg);
    } else {
        const pathImg = path.join(__dirname, `../uploads/no-img.png`); // imagen por defecto en caso de que no se envie nada
        res.sendFile(pathImg);
    }



}


module.exports = {
    fileUpload,
    retornaImagen
}