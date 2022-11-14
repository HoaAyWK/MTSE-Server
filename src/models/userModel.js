const mongoose = require('mongoose')


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
        required: true
    },
    instroduction: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
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
