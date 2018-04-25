const mongoose = require('mongoose');

const competitionSchema = require('./schema');

module.exports = mongoose.model('Competition', competitionSchema);
