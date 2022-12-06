const { ROLES } = require('../constants/constants');
const { userService, accountService, userSkillService } = require('../services');
const employerService = require('../services/employerService');
const freelancerService = require('../services/freelancerService');
const ApiError = require('../utils/ApiError');

class UserController{
    async getCurrentUser(req, res, next) {
        try{
            if(!req.userId){
                res.status(400).json({
                    success: false,
                    message: "Unauthorization"
                }); 
            }
            const user = await userService.getUserById(req.userId)
            const employer = await employerService.getEmployerByUserId(req.userId)
            const freelancer = await freelancerService.getFreelancerByUserId(req.userId)
            const account = await accountService.getAccountByUserId(req.userId)
            const userSkills = await userSkillService.getUserSkillsByUser(req.userId);
            user._doc.role = account.role;

            return res.status(200).json({
                success: true,
                user,
                employer,
                freelancer,
                userSkills,
            })
        }
        catch(error){
            res.status(500).json({
                success: false,
                message: "Internal Error Server"
            }); 
        }
    }


    async updateUser(req, res, next) {
        try {
            if (!req.userId){
                return res.status(400).json({
                    success: false,
                    message: "Unauthorization"
                })
            }

            const user = await userService.getUserById(req.userId)
            if (!user){
                return res.status(400).json({
                    success: false,
                    message: "User not Found"
                })
            }
            
            const skills = req.body.skills;

            if (skills && skills.length > 0) {
                const userSkills = await userSkillService.getUserSkillsByUser(req.userId);

                for (let uk of userSkills) {
                    if (!skills.includes(uk.skill)) {
                        await userSkillService.deleteuserSkill(uk.id);
                    }
                }

                for (let skill of skills) {
                    const userSkill = await userSkillService.getUserSkillByUserAndSkill(req.userId, skill);
                    if (!userSkill) {
                        await userSkillService.createUserSkill({ user: req.userId, skill });
                    }
                }
            }

            await userService.updateUser(req.userId, req.body)
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error Internal Server"
            })
        }
    }

    async getUserByProfile(req, res){
        try{
            if(!req.userId){
                res.status(400).json({
                    success: false,
                    message: "Unauthorization"
                }); 
            }
            const user = await userService.getUserById(req.userId)
            const employer = await employerService.getEmployerByUserId(req.userId)
            const freelancer = await freelancerService.getFreelancerByUserId(req.userId)

            return res.status(200).json({
                success: true,
                user,
                employer,
                freelancer
            })
        }
        catch(error){
            res.status(500).json({
                success: false,
                message: "Internal Error Server"
            }); 
        }
    }
}   

module.exports = new UserController