var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var teamSchema = new Schema({
    idea: {type: Schema.Types.ObjectId, ref: 'Idea', required: true},
    memberInfo: {type: Schema.Types.ObjectId, ref: 'User', unique: true, index: true, required: true},
    createdDate: Date,
    updatedDate: {type: Date, default: Date.now}
});
teamSchema.index({idea: 1, memberInfo: 1}, {unique: true});
module.exports = mongoose.model('Team', teamSchema);