const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const { toJSON } = require('./plugins');

const caegoryJobSchema = new Schema({
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

caegoryJobSchema.plugin(toJSON);

const CategoryJob = mongoose.model('CategoryJob', caegoryJobSchema);

module.exports = CategoryJob;
