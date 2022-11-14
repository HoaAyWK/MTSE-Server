const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const { toJSON } = require('./plugins');

const commnetSchema = new Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    content: {
        type: String,
        required: true
    },
    star: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    }
}, { timestamps: true });

commnetSchema.plugin(toJSON);

const Comment = mongoose.model('Comment', commnetSchema);

module.exports = Comment;
