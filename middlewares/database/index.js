const mongoose = require('mongoose');

module.exports = {
  connect: (dbHost = 'localhost', dbPort = 27017, dbName = 'development') =>
    mongoose.connect(`mongodb://${dbHost}:${dbPort}/${dbName}`)
}
