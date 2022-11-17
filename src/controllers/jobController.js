const { ROLES } = require('../constants/constants')
const accountService = require('../services/accountService')
const jobService = require('../services/jobService')
const employerService = require('../services/employerService')
const { calTotalPages } = require('../utils/page')
const categoryJobService = require('../services/categoryJobService')
const categoryService = require('../services/categoryService')


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

            if (employer.canPost == 0){
                return res.status(400).json({
                    success: false,
                    message: "You have run of Posts the Job"
                })
            }

            req.body.employer = employer.id

            const newJob = await jobService.createJob(req.body)
            await employerService.handlePost(employer, false, 1)

            const {categories} = req.body

            if (categories){
                for (var i=0; i<categories.length; i++){
                    await categoryJobService.createCategoryJob({job: newJob.id, category: categories[i]})
                }
            }

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

    async getJobById(req, res){
        try{
            if (!req.query.id){
                return res.status(400).json({
                    success: false,
                    message: "Unknow Job"
                })
            }

            const job = await jobService.getJobById(req.query.id)
            const employer = await employerService.getEmployerById(job.employer)
            job.employer = employer
            const categories = await categoryJobService.getCategoriesByJob(job.id)
            for (var i=0; i<categories.length; i++){
                var category = await categoryService.getCategoryById(categories[i].category)
                categories[i].category = category
            }
            return res.status(200).json({
                success: true,
                job,
                categories
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


    async getJobs(req, res){
        try{
            const {page, num} = req.query
            
            const jobs = await jobService.getJobs(num, page)
            const length = await jobService.getNumOfJobs()

            return res.status(200).json({
                jobs,
                length,
                totalPages: calTotalPages(num, length)
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

    async changeStatus(req, res){
        try{
            if (!req.userId){
                return res.status(400).json({
                    success: false,
                    message: "Unauthorization"
                })
            }
            if (!req.params.id){
                return res.status(400).json({
                    success: false,
                    message: "Unknow Job"
                })
            }

            const job = await jobService.getJobById(req.params.id)

            if (!job){
                return res.status(400).json({
                    success: false,
                    message: "Unknow Job"
                })
            }

            const employer = await employerService.getEmployerByUserId(req.userId)
            if (employer == null){
                return res.status(400).json({
                    success: false,
                    message: "You are not Employer"
                })
            }
            if (employer.id != job.employer){
                return res.status(400).json({
                    success: false,
                    message: "You are Owner of Job"
                })
            }
            

            await jobService.changeStatus(req.params.id, job.status)

            return res.status(200).json({
                success: true,
                message: "Change Status Successfully"
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

    async getJobsByCategory(req, res){
        try{
            const categoryId = req.query.id


            if (!categoryId){
                return res.status(400).json({
                    success: false,
                    message: "Unknow Category"
                })
            }

            const jobs = await jobService.getJobsByCategory(categoryId)


            return res.status(500).json({
                success: true,
                jobs
            })
        }
        catch(error){
            return res.status(500).json({
                success: false,
                message: "Internal Error Server"
            })
        }
    }

    async editJob(req, res){
        try{
            if (!req.userId){
                return res.status(400).json({
                    success: false,
                    message: "Unauthorization"
                })
            }

            const job = await jobService.getJobById(req.body.jobId)

            if (!job){
                return res.status(400).json({
                    success: false,
                    message: "Unknow Job"
                })
            }

            const employer = await employerService.getEmployerByUserId(req.userId)
            if (employer == null){
                return res.status(400).json({
                    success: false,
                    message: "You are not Employer"
                })
            }
            if (employer.id != job.employer){
                return res.status(400).json({
                    success: false,
                    message: "You are Owner of Job"
                })
            }

            await jobService.updateJob(req.body.jobId, req.body)


            const {categories} = req.body

            await categoryJobService.deleteAllCategoriesByJob(req.body.jobId)

            for (var i=0; i<categories.length; i++){
                await categoryJobService.createCategoryJob({job: req.body.jobId, category: categories[i]})
            }

            
            return res.status(200).json({
                success: true,
                message: "Edit Job Success"
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

module.exports = new JobController