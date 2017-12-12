const Place = require('../models/Place');
const upload = require('../config/upload');
const helpers = require('./helpers');

const validParams = ['title','description','acceptsCreditCard','openHour','closeHour', 'address'];

function find(req, res, next) {
    Place.findOne({slug: req.params.id})
    .then(place => {
        req.place = place;
        next();
    })
    .catch(err => {
        next(err);
    })
}

function index(req, res) {
    // Collección de registros
    Place.paginate({}, { page: req.query.page || 1, limit: 5, sort: { '_id': -1} })
    .then(docs => {
        res.json(docs);
    })
    .catch(err => {
        console.log(err);
        res.json(err);
    });
}

function create(req, res, next) {
    // Creacion de registro
    const params = helpers.paramsBuilder(validParams, req.body);

    req.place = Object.assign(req.place, params);
  
    Place.create(req.place)
    .then(doc => {
        req.place = doc;
        next();
    })
    .catch(err => {
        next(err);
    });
}

function show(req, res) {
    // Buscar registro individual
    res.json(req.place);
}

function update(req, res) {
    // Actualizar registro
    const params = helpers.paramsBuilder(validParams, req.body);

    req.place = Object.assign(req.place, params);
    
    req.place.save().then(doc => {
        res.json(doc)
    })
    .catch(err => {
        console.log(err);
        res.json(err);
    });
}

function destroy(req, res) {
    // Eliminar registro
    req.place.remove().then(doc => {
        res.json(doc)
    })
    .catch(err => {
        console.log(err)
        res.json(err)
    })
}

function getPlaceParams(req) {
    
    let params = {};
    
    
}

function multerMiddleware() {
    return upload.fields([
        {name: 'avatar', maxCount: 1},
        {name: 'cover', maxCount: 1}
    ]);
}

function saveImage(req, res) {
    if (req.place) {

        const files = ['avatar', 'cover'];
        const promises = [];

        files.forEach(imageType => {
            if(req.files && req.files[imageType]) {
                const path = req.files[imageType][0].path;
                promises.push(req.place.uploadImage(path, imageType));
            }
        })

        Promise.all(promises).then(results => {
            console.log(results);
            res.json(req.place);
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        }) 

    } else {
        res.status(422).json({
            error: req.error || 'Cloud not save place'
        })
    }
}

module.exports = {index, show, create, update, destroy, find, multerMiddleware, saveImage};