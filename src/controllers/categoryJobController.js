const userService = require('../services/userService')
const accountService = require('../services/accountService')
const employerService = require('../services/employerService')
const jobService = require('../services/jobService')
const categoryJobService = require('../services/categoryJobService')

class JobCategoryController{
    async addJobCategories(req, res){
        try{
            const {categories, jobId} = req.body

            if(!req.userId){
                return res.status(400).json({
                    success: false,
                    message: "Unauthorization"
                })
            }

            const account = await accountService.getAccountByUserId(req.userId)
            if (account == null || account.role != "Employer"){
                return res.status(400).json({
                    success: false,
                    message: "You are not Employer"
                })
            }

            const employer = await employerService.getEmployerByUserId(req.userId)
            
            if (employer == null){
                return res.status(400).json({
                    success: false,
                    message: "You are not Employer"
                })
            }

            const job = await jobService.getJobById(jobId)
            if (job == null || job.employer != employer.id){
                return res.status(400).json({
                    success: false,
                    message: "Unknow job"
                })
            }

            for (var i=0; i<categories.length; i++){
                await categoryJobService.createCategoryJob({job, category: categories[i]})
            }

            return res.status(200).json({
                success: true,
                message: "Add Categories Successfully"
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

module.exports = new JobCategoryController