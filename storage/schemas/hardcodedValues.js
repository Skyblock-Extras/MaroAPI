const mongoose = require('mongoose');

const hardcodedValuesSchema = new mongoose.Schema({
  id: String,
  price : Double,
  count : Integer
});

module.exports = mongoose.model('hardcodedValues', hardcodedValuesSchema, 'hardcodedValues');
  