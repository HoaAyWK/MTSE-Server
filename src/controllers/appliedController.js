const appliedService = require('../services/appliedService')
const accountService = require('../services/accountService')
const jobService = require('../services/jobService')
const freelancerService = require('../services/freelancerService')
const employerService = require('../services/employerService')

class AppliedController{
    async addApply(req, res){
        try{
            if(!req.userId){
                return res.status(400).json({
                    success: false,
                    message: "Unauthorization"
                })
            }

        
            const account = await accountService.getAccountByUserId(req.userId)

            if (account == null || account.role != "Freelancer"){
                return res.status(400).json({
                    success: false,
                    message: "You are not Freelancer"
                })
            }

            const freelancer = await freelancerService.getFreelancerByUserId(req.userId)

            if (!freelancer){
                return res.status(400).json({
                    success: false,
                    message: "You are not Freelancer"
                })
            }

            req.body.freelancer = freelancer.id

            const job = await jobService.getJobById(req.body.job) 
            if (job == null || job.status == false || job.expireDate < Date.now()){
                return res.status(400).json({
                    success: false,
                    message: "Job is Unavailable"
                })
            }

            const newApply = await appliedService.createApplied(req.body)

            return res.status(200).json({
                success: true,
                message: "Apply to job Successfully",
                applied: newApply
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

    async cancelApplied(req, res){
        try{
            if(!req.userId){
                return res.status(400).json({
                    success: false,
                    message: "Unauthorization"
                })
            }

            const account = await accountService.getAccountByUserId(req.userId)

            if (account == null || account.role != "Freelancer"){
                return res.status(400).json({
                    success: false,
                    message: "You are not Freelancer"
                })
            }

            const freelancer = await freelancerService.getFreelancerByUserId(req.userId)

            if(!freelancer){
                return res.status(400).json({
                    success: false,
                    message: "Unknow Freelancer"
                })
            }

            const applied = await appliedService.getAppliedByFreelancerAndJob(freelancer.id, req.params.job)

            if(!applied){
                return res.status(400).json({
                    success: false,
                    message: "Unknow Your Apply"
                })
            }

            await appliedService.cancelApply(applied.id)

            return res.status(400).json({
                success: true,
                message: "Cancel Apply Successfully"
            })


        }
        catch(error){
            return res.status(500).json({
                success: false,
                message: "Internal Error Server"
            })
        }
    }

    async getAppliedByJob(req, res){
        try{
            
            if(!req.params.job){
                return res.status(400).json({
                    success: false,
                    message: "Unknow Job"
                })
            }

            const job = await jobService.getJobById(req.params.job)

            if (!job){
                return res.status(400).json({
                    success: false,
                    message: "Unknow Job"
                })
            }

            const employer = await employerService.getEmployerByUserId(req.userId)

            if (!employer){
                return res.status(400).json({
                    success: false,
                    message: "You are not Owner of Job"
                })
            }

            if (employer.id != job.employer){
                return res.status(400).json({
                    success: false,
                    message: "You are not Owner of Job"
                })
            }

            var num = req.query.num
            var page = req.query.page

            if (!num){
                num = 5
            }
            if (!page){
                page = 1
            }

            const applied = await appliedService.getAppliedByJob(req.params.job, num, page)

            for (var i=0; i<applied.length; i++){
                var freelancer = await freelancerService.getFreelancerById(applied[i].freelancer)
                applied[i].freelancer = freelancer
            }

            return res.status(200).json({
                applies: applied,
                job,
                employer
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
}

module.exports = new AppliedController