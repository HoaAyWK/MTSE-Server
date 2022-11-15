const ApiError = require('../utils/ApiError');
const { Skill } = require('../models');

class SkillService {
    async getSkills(num, page) {
        const skills = await Skill.find()
        const length = skills.length
        if (num == null || page == null){
            return skills
        }

        var start = (page-1)*num
        if (start > length){
            return []
        }

        var end = parseInt(start) + parseInt(num)
        if (end > length){
            end = length
        }

        return skills.slice(start, end)
    }

    async getNumOfSkills(){
        const skills = await Skill.find()

        return skills.length
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
