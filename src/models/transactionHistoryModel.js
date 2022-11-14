const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const { toJSON } = require('./plugins');

const transactionHistorySchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    package: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Package'
    },
}, { timestamps: true });

transactionHistorySchema.plugin(toJSON);

const TransactionSchema = mongoose.model('TransactionSchema', transactionHistorySchema);

module.exports = TransactionSchema;
