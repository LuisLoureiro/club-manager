const mongoose = require('mongoose');

module.exports = {
  connect: (dbName = 'development', dbPort = 27017, dbHost = 'localhost') =>
    mongoose.connect(`mongodb://${dbHost}:${dbPort}/${dbName}`)
}
