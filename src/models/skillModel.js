const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const { toJSON } = require('./plugins');

const skillSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true });

skillSchema.plugin(toJSON);

const Skill = mongoose.model('Skill', skillSchema);

module.exports = Skill;
