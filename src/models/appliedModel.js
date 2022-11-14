const mongoose = require('mongoose')
const Schema = mongoose.Schema

const { toJSON } = require('./plugins');

const appliedSchema = new Schema({
    freelancer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Freelancer',
        required: true,
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true,
    },
    appliedAt: {
        type: Date,
        default: Date.now()
    },
    cancelledAt: Date,
    status: {
        type: Boolean,
        default: true,
        required: true
    }
});

appliedSchema.plugin(toJSON);

const Applied = mongoose.model('Applied', appliedSchema);

module.exports = Applied;
