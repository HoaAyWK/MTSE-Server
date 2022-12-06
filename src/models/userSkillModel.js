const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const { toJSON } = require('./plugins');

const userSkillSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    skill: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Skill'
    },
});

userSkillSchema.plugin(toJSON);

const UserSkill = mongoose.model('UserSkill', userSkillSchema);

module.exports = UserSkill;
