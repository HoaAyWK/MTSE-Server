const accountService = require('../services/accountService')
const userService = require('../services/userService')
const jwtFilter = require('../middleware/jwtFilter')
const getStreamService = require('../services/getStreamService');
const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const moment = require('moment');
const argon2 = require('argon2');

class AccountController {
    async loginAccount(req, res) {
        // email, password
        try {
            const user = await userService.getUserByEmail(req.body.email)

            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid Email or Password"
                })
            }
            const account = await accountService.getAccountByUserId(user._id)
            if (!account) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid Email or Password"
                })
            }

            if (!account.emailConfirmed){
                return res.status(400).json({
                    success: false,
                    message: "Email is not been confirmed"
                })
            }
            const checkedPassword = await accountService.checkPassword(account, req.body.password)

            if (!checkedPassword) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid Email or Password"
                })
            }
            
            const streamToken = getStreamService.getStreamToken(user.id);

            const accessToken = jwtFilter.generateToken(user._id)

            return res.status(200).json({
                success: true,
                streamToken,
                message: "Login Successfully",
                accessToken
            });
        }
        catch(error){
            console.log(error);
            return res.status(500).json({
                success: false,
                message: "Error Internal Server"
            })
        }
    }

    async confirmEmail(req, res, next) {
        try {
            const token = req.query.token;
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            const { sub } = payload;
            const account = await accountService.getAccountByUserId(sub);
            
            if (!account) {
                throw new ApiError(400, 'Email verify failed');
            }

            await accountService.updateAccount(account.id, { emailConfirmed: true, confirmEmailToken: undefined });

            const accessToken = jwtFilter.generateToken(sub);
            const streamToken = getStreamService.getStreamToken(sub);
            
            res.status(200).json({
                success: true,
                accessToken,
                streamToken
            });
        } catch (error) {
            next(error);
        }
    }

    async changePassword(req, res){
        try{
            if (!req.userId){
                return res.status(400).json({
                    success: false,
                    message: "Unauthorization"
                })
            }

            const account = await accountService.getAccountByUserId(req.userId)

            if (!account){
                return res.status(400).json({
                    success: false,
                    message: "User Not Found"
                })
            }

            const checkedPassword = await accountService.checkPassword(account, req.body.oldPassword)

            if (!checkedPassword){
                return res.status(400).json({
                    success: false,
                    message: "Password is Incorrect"
                })
            }
            
            await accountService.changePassword(account._id, req.body.newPassword)
            return res.status(200).json({
                success: true,
                message: "Change Password Successfully"
            })

        }
        catch(error){
            console.log(error)
            return res.status(500).json({
                success: false,
                message: "Error Internal Server"
            })
        }
    }

    async forgotPassword(req, res, next) {
        try {
            const user = await userService.getUserByEmail(req.body.email);
            
            if (!user) {
                throw new ApiError(400, 'User not found');
            }

            const account = await accountService.getAccountByUserId(user.id);

            if (!account) {
                throw new ApiError(400, 'Account not found');
            }

            const payload = {
                sub: user.id,
                password: req.body.password,
                iat: moment().unix(),
                expires: moment().add(30, 'minutes').toDate()
            };

            const resetPasswordToken = jwt.sign(payload, process.env.JWT_SECRET);

            await accountService.updateAccount(account._id, { resetPasswordToken });

            const url = `${process.env.CLIENT_URL}password/reset/${resetPasswordToken}`;
            const content =  `
                <div>
                    <h3>If you have not requested this email, then ignore it</h3>
                    <h3>Click the link bellow to go to reset your password</h3>
                    <a href="${url}">Reset</a>
                </div>
            `;

            accountService.sendEmail({
                email: req.body.email,
                subject: 'Reset your password',
                message: content
            });

            res.status(200).json({
                success: true,
                message: 'Sent an email'
            });

        } catch (error) {
            next(error);
        }
    }

    async resetPassword(req, res, next) {
        try {
            const token = req.query.token;
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            const { sub, password } = payload;
            const account = await accountService.getAccountByUserId(sub);
            
            if (!account) {
                throw new ApiError(400, 'Reset password failed');
            }

            const hashPassword = await argon2.hash(password)

            await accountService.updateAccount(account.id, { password: hashPassword, resetPasswordToken: undefined });

            const accessToken = jwtFilter.generateToken(sub);
            const streamToken = getStreamService.getStreamToken(sub);
            
            res.status(200).json({
                success: true,
                accessToken,
                streamToken
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AccountController