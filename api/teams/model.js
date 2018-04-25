const mongoose = require('mongoose');

const teamSchema = require('./schema');

module.exports = mongoose.model('Team', teamSchema);
