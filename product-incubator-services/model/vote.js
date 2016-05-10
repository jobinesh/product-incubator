var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserModel = require('../model/user');
var voteSchema = new Schema({
    idea: {type: Schema.Types.ObjectId, ref: 'Idea', required: true},
    comment: String,
    rating: Number,
    votedBy: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    createdDate: Date,
    updatedDate: {type: Date, default: Date.now}
});
voteSchema.index({idea: 1, votedBy: 1}, {unique: true});
module.exports = mongoose.model('Vote', voteSchema);