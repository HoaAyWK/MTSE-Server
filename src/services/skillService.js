const ApiError = require('../utils/ApiError');
const { Skill } = require('../models');

class SkillService {
    async getSkills(num) {
        let skills;

        if (num) {
            skills = await Skill.find().limit(num);
        } else {
            skills = await Skill.find();
        }

        return skills;
    }

    async getSkillsByUser(userId) {
        return await Skill.find({ user: userId });
    }

    async createSkill(skill) {
        return await Skill.create(skill);
    }

    async getSkillById(id) {
        return await Skill.findById(id);
    }

    async updateSkill(id, updateBody) {
        const skill = await Skill.findById(id).lean();

        if (!skill) {
            throw new ApiError(404, 'Skill not found');
        }

        return await Skill.findByIdAndUpdate(id, { $set: updateBody }, { new: true, runValidators: true });
    }

    async deleteSkill(id) {
        const skill = await Skill.findById(id);

        if (!skill) {
            throw new ApiError(404, 'Skill not found');
        }

        await skill.remove();
    }
}


module.exports = new SkillService;
