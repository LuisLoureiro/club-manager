const mongoose = require('mongoose');

const Schema = mongoose.Schema;

module.exports = Schema({
  name: { type: String, required: true },
  competitions: [{ type: Schema.Types.ObjectId, ref: 'Competition' }]
});
