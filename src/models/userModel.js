const mongoose = require('mongoose')
const { toJSON } = require('./plugins');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: false
    },
    instroduction: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    },
    stars: {
        type: Number,
        required: true,
        default: 0
    },
    vip: {
        type: Number,
        requried: true,
        default: 0
    },
}, { timestamps: true });

UserSchema.plugin(toJSON);

const User = mongoose.model('User', UserSchema);

module.exports = User;
