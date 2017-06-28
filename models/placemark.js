var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Placemark', new Schema({
    name: String,
    style: String,
    styleHash: String,
    description: String,
    image: String,
    latitude: Number,
    longitude: Number
}, {
    versionKey: false
}));