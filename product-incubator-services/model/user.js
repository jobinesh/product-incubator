var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: {type: String, unique: true, index: true, required: true},
    jobTitle: String,
    team: String,
    rating: {type: Number, default: 5},
    potential: {type: Number, default: 5},
    socialMedia: [{name: String, handle: String}],
    phone: String,
    createdDate: Date,
    updatedDate: {type: Date, default: Date.now}
});

module.exports = mongoose.model('User', userSchema);