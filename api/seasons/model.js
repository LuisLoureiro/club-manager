const mongoose = require('mongoose');

const seasonSchema = require('./schema');

module.exports = mongoose.model('Season', seasonSchema);
