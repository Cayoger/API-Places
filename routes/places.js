var express = require('express');

let router = express.Router();

const placeController = require('../controllers/PlacesController')

router.route('/')
    // Crear
    .post(
        placeController.multerMiddleware(),
        placeController.create,
        placeController.saveImage)
    // Listar
    .get(placeController.index)

router.route('/:id')
    // Buscar
    .get(placeController.find, placeController.show)
    // Actualizar
    .put(placeController.find, placeController.update)
    // Eliminar
    .delete(placeController.find, placeController.destroy)
      
module.exports = router;