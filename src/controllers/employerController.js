const employerService = require('../services/employerService')
const userService = require('../services/userService')
const accountService = require('../services/accountService')
const ApiError = require('../utils/ApiError')
const { ROLES, MESSAGE_ERRORS } = require('../constants/constants')
const userSkillService = require('../services/userSkillService')
const moment = require('moment');
const jwt = require('jsonwebtoken');

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

            req.body.user = newUser.id

            await employerService.saveEmployer(req.body)

            req.body.role = ROLES.EMPLOYER;

            const account = await accountService.saveAccount(req.body);

            const payload = {
                sub: newUser.id,
                accountId: account._id,
                iat: moment().unix(),
                expires: moment().add(30, 'minutes').toDate()
            };

            const confirmEmailToken = jwt.sign(payload, process.env.JWT_SECRET);

            await accountService.updateAccount(account._id, { confirmEmailToken });

            const url = `${process.env.CLIENT_URL}email/confirm/${confirmEmailToken}`;
            const content =  `
                <div>
                    <h3>If you have not requested this email, then ignore it</h3>
                    <h3>Click the link bellow to confirm your email</h3>
                    <a href="${url}">Confirm Email</a>
                </div>
            `;

            accountService.sendEmail({
                email: req.body.email,
                subject: 'Confirm your email',
                message: content
            });

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

    async getEmployerById(req, res){
        try{
            const {id} = req.query
            if (!id){
                return res.status(400).json({
                    success: false,
                    message: "Unknow Employer"
                })
            }
            
            const employer = await employerService.getEmployerById(id);
            const userSkills = await userSkillService.getUKByUserAndLean(employer.user._id);

            employer['userSkills'] = userSkills;

            return res.status(200).json({
                employer
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