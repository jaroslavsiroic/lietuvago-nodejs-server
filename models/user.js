var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('User', new Schema({
    username: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    visited: [ { id: Schema.ObjectId } ]
}, {
    versionKey: false
}));