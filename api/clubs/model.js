const mongoose = require('mongoose');

const clubSchema = require('./schema');

module.exports = mongoose.model('Club', clubSchema);
