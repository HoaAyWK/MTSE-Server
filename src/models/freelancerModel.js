const mongoose = require('mongoose');

const { toJSON } = require('./plugins');

const freelancerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    gender: {
        type: String,
        default: 'Male',
        required: true,
        enum: [
            'Male',
            'Female'
        ]
    },
    cv: {
        type: String,
    },
    doneJobs: {
        type: String
    }
});

freelancerSchema.plugin(toJSON);

const Freelancer = mongoose.model('Freelancer', freelancerSchema);

module.exports = Freelancer;
