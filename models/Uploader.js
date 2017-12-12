const cloudinary = require('cloudinary');

const secret = require('../config/secrets');

cloudinary.config(secret.cloudinary);

module.exports = function(imgPath) {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(imgPath, function(result) {
            console.log(result);
            if (result.secure_url) return resolve(result.secure_url);

            reject(new Error('Error: Ocurrio un error en el servidor de cloudinary.'));
        });
    });
}