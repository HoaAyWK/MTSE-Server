const employerService = require('../services/employerService')
const userService = require('../services/userService')
const accountService = require('../services/accountService')
const ApiError = require('../utils/ApiError')
const { ROLES, MESSAGE_ERRORS } = require('../constants/constants')

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
            return res.status(500).json({
                success: false,
                message: "Internal Error Server"
            })
        }

    }

    async getEmployers(req, res, next) {
        try {
            const account = await accountService.getAccountByUserId(req.userId);

            if (!account) {
                throw new ApiError(400, 'Acount not found');
            }

            if (account.role !== ROLES.ADMIN) {
                throw new ApiError(403, MESSAGE_ERRORS.UNAUTHORIZE);
            }

            const employers = await employerService.getEmployers();

            res.status(200).json({
                success: true,
                employers
            });
        } catch (error) {
            next(error);
        }
    }

    async editEmployer(req, res){
        try{
            if (!req.userId){
                return res.status(400).json({
                    success: false,
                    message: "Unauthorization"
                })
            }

            const account = await accountService.getAccountByUserId(req.userId)
            const employer = await employerService.getEmployerByUserId(req.userId)
            if (account == null || account.role != "Employer" || employer == null){
                return res.status(400).json({
                    success: false,
                    message: "Unknow Employer"
                })
            }

            await employerService.editEmployer(employer.id, req.body)

            return res.status(200).json({
                success: true,
                message: "Edit Information Successfully"
            })

        }
        catch(error){
            return res.status(500).json({
                success: false,
                message: "Internal Error Server"
            })
        }
    }


    
}

module.exports = new EmployerController