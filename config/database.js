const mongoose = require('mongoose');
const dbName = 'places_facilito_api';

module.exports = {
  connect: () => mongoose.connect('mongodb://localhost/' + dbName),
  dbName,
  connection: () => {
    if (mongoose.connection) return mongoose.connection;
    return this.connect();
  }
};
