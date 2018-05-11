const mongoose = require('mongoose');

const Schema = mongoose.Schema;

module.exports = Schema({
  name: { type: String, required: true },
  clubs: [{ type: Schema.Types.ObjectId, ref: 'Club' }]
});
