const ApiError = require('../utils/ApiError');
const { UserSkill } = reuqire('../models');

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

    async createUserSkill(userSkill) {
        return await UserSkill.create(userSkill);
    }

    async getUserSkillById(id) {
        return await UserSkill.findById(id);
    }

    async getUserSkillsByUser(userId) {
        return await UserSkill.find({ user: userId })
            .populate('user skill')
    }

    async getUserSkillsBySkill(skillId)

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
}

module.exports = new UserSkillService;
