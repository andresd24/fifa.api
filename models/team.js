'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TeamSchema = Schema({
    name: String,
    country: String,
    league: String,
    year: Number,
    image: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Team', TeamSchema);