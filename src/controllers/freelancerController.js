const freelancerService = require('../services/freelancerService')
const userService = require('../services/userService')
const accountService = require('../services/accountService')
const ApiError = require('../utils/ApiError')
const { ROLES, MESSAGE_ERRORS } = require('../constants/constants')

class FreelancerController {
    async registerFreelancer(req, res) {
        try {
            const checkEmail = await userService.getUserByEmail(req.body.email)

            if (checkEmail) {
                return res.status(400).json({
                    success: false,
                    message: 'Email has been taken'
                })
            }

            const newUser = await userService.saveUser(req.body)
            req.body.user = newUser.id
            await accountService.saveAccount(req.body)
            await freelancerService.saveFreelancer(req.body)

            return res.status(400).json({
                success: true,
                message: "Register Freelancer Successfully"
            })
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: "Error Internal Server"
            })
        }
    }


    async getFreelancers(req, res, next) {
        try {
            const account = await accountService.getAccountByUserId(req.userId);

            if (!account) {
                throw new ApiError(400, 'Account not found');
            }

            if (account.role !== ROLES.ADMIN) {
                throw new ApiError(403, MESSAGE_ERRORS.UNAUTHORIZE);
            }

            const freelancers = await freelancerService.getFreelancers();

            res.status(200).json({
                success: true,
                freelancers
            });
        } catch (error) {
            next(error);
        }
    }
}


module.exports = new FreelancerController