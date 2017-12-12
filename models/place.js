const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const uploader = require('./Uploader');
const slugify = require('../plugins/slugify')

let placeSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true
  },
  slug: {
    type: String,
    unique: true
  },
  address: String,
  description: String,
  acceptsCreditCard: {
    type: Boolean,
    default: false
  },
  coverImage: String,
  avatarImage: String,
  openHour: Number,
  closeHour: Number
});

placeSchema.methods.uploadImage = function(path, imageType) {
  // subir la imagen

  // guardar el lugar
  return uploader(path)
          .then(secure_url => this.saveImageUrl(secure_url, imageType));
}

placeSchema.methods.saveImageUrl = function(secureUrl, imageType) {
  this[imageType + 'Image'] = secureUrl;
  return this.save();
}

placeSchema.pre('save', function(next) {
  if (this._id) return next();
  generateSlugAndContinue.call(this, 0, next);
})

placeSchema.statics.validateSlugCount = function(slug) {
  return Place.count({slug: slug}).then(count => {
    if (count > 0) return false;
    return true;
  })
}

placeSchema.plugin(mongoosePaginate);

function generateSlugAndContinue(count, next) {
  // convertimos el titulo por un nombre slug y se lo asignamos a slug
  this.slug = slugify(this.title);
  // en caso de que count se a distinto a 0, significa que la rellamaron
  if (count != 0) this.slug = this.slug + "-" + count;

  Place.validateSlugCount(this.slug).then(isValid => {
    if (!isValid) return generateSlugAndContinue.call(this, count + 1, next);

    next();
  }); 
}

let Place = mongoose.model('Place', placeSchema);

module.exports = Place;
