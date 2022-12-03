const accountService = require('../services/accountService')
const userService = require('../services/userService')
const jwtFilter = require('../middleware/jwtFilter')
const getStreamService = require('../services/getStreamService');

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
}

module.exports = new AccountController