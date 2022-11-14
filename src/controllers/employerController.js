const employerService = require('../services/employerService')
const userService = require('../services/userService')
const accountService = require('../services/accountService')

class EmployerController{
    async registerEmployer(req, res){
        try{
            const checkedEmail = await userService.getUserByEmail(req.body.email)

            if (checkedEmail){
                return res.status(400).json({
                    success: false,
                    message: "Email has been taken"
                })
            }
    
    
            const newUser = await userService.saveUser(req.body)
    
            req.body.user = newUser._id
    
            await accountService.saveAccount(req.body)
            await employerService.saveEmployer(req.body)
    
            return res.status(200).json({
                success: true,
                message: "Register Employer Successfully"
            })
        }
        catch(error){
            console.log(error)
            return res.status(400).json({
                success: false,
                message: "Internal Error Server"
            })
        }

    }
}

module.exports = new EmployerController