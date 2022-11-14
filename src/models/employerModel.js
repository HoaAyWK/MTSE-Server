const mongoose = require('mongoose');

const { toJSON } = require('./plugins');

const employerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    companyName: {
        type: String,
    },
    companySize: {
        type: String,
    },
    companyType: {
        type: String,
    },
    foundingDate: {
        type: Date
    },
    info: {
        type: [String]
    },
    canPost: {
        type: Number,
        required: true,
        default: 3
    }
}, { timestamps: true });

employerSchema.plugin(toJSON);

const Employer = mongoose.model('Employer', employerSchema);

module.exports = Employer;
