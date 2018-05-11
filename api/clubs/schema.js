const mongoose = require('mongoose');

const Schema = mongoose.Schema;

module.exports = Schema({
  fullName: { type: String, required: true },
  shortName: String,
  acronym: { type: String, required: true },
  teams: [{ type: Schema.Types.ObjectId, ref: 'Team' }]
});
