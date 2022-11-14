const mongoose = require('mongoose');
const { JOB_STATUS } = require('../constants/constants');
const Schema = mongoose.Schema;

const { toJSON } = require('./plugins');

const jobSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    price: {
        type: Number,
        reqired: true
    },
    status: {
        type: Boolean,
        default: true,
        required: true
    },
    employer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employer',
        required: true
    }
}, { timestamps: true });

jobSchema.plugin(toJSON);

const Category = mongoose.model('Category', jobSchema);

module.exports = Category;
