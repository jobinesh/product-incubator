var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var resourceSchema = new Schema({
    idea: {type: Schema.Types.ObjectId, ref: 'Idea', required: true},
    resourceTitle: {type: String, index: true, required: true},
    links: [String],
    docs: [Buffer],
    createdDate: Date,
    updatedDate: {type: Date, default: Date.now}
});
resourceSchema.index({idea: 1, resourceTitle: 1}, {unique: true});
module.exports = mongoose.model('Resource', resourceSchema);