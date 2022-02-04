const mongoose = require('mongoose');

const dupeSchema = new mongoose.Schema({
    id: String,
    uuid: String,
    count: Number
});

module.exports = mongoose.model('dupes', dupeSchema, 'dupes');
