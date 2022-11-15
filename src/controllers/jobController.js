const { ROLES } = require('../constants/constants')
const accountService = require('../services/accountService')
const jobService = require('../services/jobService')
const employerService = require('../services/employerService')

class JobController{
    async createJob(req, res){
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
                    message: "Unknow User"
                })
            }

            if(account.role != 'Employer'){
                return res.status(400).json({
                    success: false,
                    message: "You are not Employer"
                })
            }

            const employer = await employerService.getEmployerByUserId(req.userId)

            

            req.body.employer = employer.id

            const newJob = await jobService.createJob(req.body)

            return res.status(200).json({
                success: true,
                message: "Create Job Successfully",
                job: newJob
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

module.exports = new JobController