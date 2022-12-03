const { ROLES } = require('../constants/constants');
const { userService, accountService } = require('../services');
const employerService = require('../services/employerService');
const freelancerService = require('../services/freelancerService');
const ApiError = require('../utils/ApiError');

class UserController{
    async getCurrentUser(req, res, next) {
        try {
            const user = await userService.getUserById(req.userId);

            if (!user) {
                throw new ApiError(404, 'User not found');
            }

            const account = await accountService.getAccountByUserId(req.userId);

            if (!account) {
                throw new ApiError(404, 'Account not found');
            }

            user._doc.role = account.role;

            if (account.role === ROLES.FREELANCER) {
                const freelancer = await freelancerService.getFreelancerByUserId(req.userId);

                if (freelancer) {
                    user._doc.freelancer = freelancer;
                }
            }

            if (account.role === ROLES.EMPLOYER) {
                const employer = await employerService.getEmployerByUserId(req.userId);

                if (employer) {
                    user._doc.employer = employer;
                }
            }

            res.status(200).json({
                success: true,
                user
            });

        } catch (error) {
            next(error);
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
}   

module.exports = new UserController