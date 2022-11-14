const mongoose = require('mongoose')
const Schema = mongoose.Schema

const { toJSON } = require('./plugins');

const CategorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String
    }
}, { timestamps: true });

CategorySchema.plugin(toJSON);

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;
