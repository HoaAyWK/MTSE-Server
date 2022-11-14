const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const { toJSON } = require('./plugins');

const categoryJobModel = new Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Job'
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Category'
    },
});

categoryJobModel.plugin(toJSON);

const CategoryJob = mongoose.model('CategoryJob', categoryJobModel);

module.exports = CategoryJob;
