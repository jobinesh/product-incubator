var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ideaSchema = new Schema({
    title: {type: String, unique: true, index: true, required: true},
    summary: {type: String, required: true},
    status: {type: String, enum: ['New', 'Review', 'Accepted', 'Rejected'], default: 'New'},
    totalPoints: {type: Number, default: 0},
    submittedBy: {type: Schema.Types.ObjectId, ref: 'User'},
    createdDate: Date,
    updatedDate: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Idea', ideaSchema);