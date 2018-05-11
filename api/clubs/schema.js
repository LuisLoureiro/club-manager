const mongoose = require('mongoose');

module.exports = mongoose.Schema({
  fullName: { type: String, required: true },
  shortName: String,
  acronym: { type: String, required: true }
});
