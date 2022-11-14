const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const { toJSON } = require('./plugins');

const packageSchema = new Schema({
    description: {
        type: String,
        required: true
    },
    point: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    canPost: {
        type: Number,
        required: true
    },
}, { timestamps: true });

packageSchema.plugin(toJSON);

const Package = mongoose.model('Package', packageSchema);

module.exports = Package;
