const { userService, accountService } = require('../services');
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