const mongoose = require('mongoose');

const Schema = mongoose.Schema;

module.exports = Schema({
  name: { type: String, required: true },
  seasons: [{ type: Schema.Types.ObjectId, ref: 'Season' }]
});
