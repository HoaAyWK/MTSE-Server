const freelancerService = require('../services/freelancerService')
const userService = require('../services/userService')
const accountService = require('../services/accountService')

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
}


module.exports = new FreelancerController