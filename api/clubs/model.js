const mongoose = require('mongoose');

const clubSchema = require('./schema');

const Club = mongoose.model('Club', clubSchema);

module.exports = Club;
