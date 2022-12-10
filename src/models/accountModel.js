const mongoose = require('mongoose');
const { ROLES } = require('../constants/constants');

const { toJSON } = require('./plugins');

const accountSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    password: {
        type: String,
        required: true
    },
    emailConfirmed: {
        type: Boolean,
        required: true,
        default: false
    },
    role: {
        type: String,
        required: true,
        default: ROLES.FREELANCER
    },
    confirmEmailToken: String,
    resetPasswordToken: String,
}, { timestamps: true });

accountSchema.plugin(toJSON);
/* 
accountSchema.pre('save', async function(next) {
    if (this.password === null || !this.isModified('password')) {
        next();
    }

    this.password = await hash(this.password, 10);
}); */

accountSchema.methods.isPasswordMatch = async function(password) {
    return compare(password, this.password);
};

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
