const ApiError = require('../utils/ApiError');
const { skillService, userSkillService, accountService } = require('../services');
const { ROLES } = require('../constants/constants');

class SkillController {
    async getSkills(req, res, next) {
        try {
            const num = req.query.num;
            const skills = await skillService.getSkills(num);

            res.status(200).json({
                success: true,
                count: skills.length,
                skills
            });
        } catch (error) {
            next(error);
        }
    }

    async getSkill(res, req, next) {
        try {
            const id = req.params.id;

            if (!id) {
                throw new ApiError(400, 'Params must have id');
            }
            
            const skill = await skillService.getSkillById(id);

            if (!skill) {
                throw new ApiError(404, 'Skill not found');
            }

            res.status(200).json({
                success: true,
                skill
            });

        } catch (error) {
            next(error);
        }
    }

    async createSkill(req, res, next) {
        try {
            const userId = req.userId;

            const account = await accountService.getAccountByUserId(userId);

            if (!account) {
                throw new ApiError(404, 'Account not found');
            }

            if (account.role !== ROLES.ADMIN) {
                throw new ApiError(403, "You don't have permission to access this resource");
            }

            const skill = await skillService.createSkill(req.body);

            res.status(201).json({
                success: true,
                skill
            });

        } catch (error) {
            next(error);
        }
    }

    async updateSkill(req, res, next) {
        try {
            const userId = req.userId;

            const account = await accountService.getAccountByUserId(userId);

            if (!account) {
                throw new ApiError(404, 'Account not found');
            }

            if (account.role !== ROLES.ADMIN) {
                throw new ApiError(403, "You don't have permission to access this resource");
            }

            const id = req.params.id;

            if (!id) {
                throw new ApiError(400, 'Params must have id');
            }

            const numOfUserSkill = await userSkillService.countUserSkillsBySkill(id);

            if (numOfUserSkill > 0) {
                throw new ApiError(400, 'Another UserSkill already references this skill');
            }

            const skill = await skillService.updateSkill(id, req.body);

            res.status(200).json({
                success: true,
                skill
            });

        } catch (error) {
            next(error);
        }
    }

    async deleteSkill(req, res, next) {
        try {
            const id = req.params.id;

            if (!id) {
                throw new ApiError(400, 'Params must have id');
            }

            const numOfUserSkill = await userSkillService.countUserSkillsBySkill(id);

            if (numOfUserSkill > 0) {
                throw new ApiError(400, 'Another UserSkill already references this skill');
            }

            await skillService.deleteSkill(id);

            res.status(200).json({
                success: true,
                message: "Deleted successfully"
            });

        } catch (error) {
            next(error);
        }
    }
}

module.exports = new SkillController;
