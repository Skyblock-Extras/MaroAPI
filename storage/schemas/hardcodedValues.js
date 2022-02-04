const mongoose = require('mongoose');

const hardcodedValuesSchema = new mongoose.Schema({
  id: String,
  price : Number,
  count : Number
});

module.exports = mongoose.model('hardcodedValues', hardcodedValuesSchema, 'hardcodedValues');
  