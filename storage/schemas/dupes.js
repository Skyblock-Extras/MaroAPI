const mongoose = require('mongoose');

const dupeSchema = new mongoose.Schema({
    id: String,
    itemId: String,
    count: Number,
    auctions: Object
});

module.exports = mongoose.model('dupes', dupeSchema, 'dupes');
