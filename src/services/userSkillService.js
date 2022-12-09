const ApiError = require('../utils/ApiError');
const { UserSkill } = require('../models');

class UserSkillService {
    async getUserSkills(num) {
        let userSkills;

        if (num) {
            userSkills = await Category.find().limit(num);
        } else {
            userSkills = await Category.find();
        }

        return userSkills;
    }

    async getUserSkillByUserAndSkill(userId, skillId) {
        return await UserSkill.findOne({ user: userId, skill: skillId });
    }

    async getUsersBySkill(skillId){
        return await UserSkill.find({skill: skillId})
    }

    async createUserSkill(userSkill) {
        return await UserSkill.create(userSkill);
    }

    async getUserSkillById(id) {
        return await UserSkill.findById(id);
    }

    async getUserSkillsByUser(userId) {
        return await UserSkill.find({ user: userId })
              .populate('skill')
    }

    async countUserSkillsBySkill(skillId) {
        return await UserSkill.count({ skill: skillId });
    }

    async updateUserSkill(id, updateBody) {
        const userSkill = await UserSkill.findById(id).lean();

        if (!userSkill) {
            throw new ApiError(404, 'UserSkill not found');
        }

        return await UserSkill.findByIdAndUpdate(id, { $set: updateBody }, { new: true, runValidators: true });
    }

    async deleteuserSkill(id) {
        const userSkill = await UserSkill.findById(id);

        if (!userSkill) {
            throw new ApiError(404, 'UserSkill not found');
        }

        await userSkill.remove();
    }

    async getUKByUserAndLean(userId) {
        return await UserSkill.find({ user: userId })
            .lean()
            .populate('skill');
    }
}

module.exports = new UserSkillService;
