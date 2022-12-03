const { ROLES } = require('../constants/constants');
const { userService, accountService } = require('../services');
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
            user._doc.role = account.role;

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


    async updateUser(req, res, next) {
        try {
            const user = await userService.updateUser(req.userId, req.body);
            const account = await accountService.getAccountByUserId(req.userId);

            if (!account) {
                throw new ApiError(400, 'Account not found');
            }

            user._doc.role = account.role;

            res.status(200).json({
                success: true,
                user
            });
        } catch (error) {
            next(error);
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