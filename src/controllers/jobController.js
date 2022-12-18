const { ROLES } = require('../constants/constants')
const accountService = require('../services/accountService')
const jobService = require('../services/jobService')
const employerService = require('../services/employerService')
const { calTotalPages } = require('../utils/page')
const categoryJobService = require('../services/categoryJobService')
const categoryService = require('../services/categoryService')
const ApiError = require('../utils/ApiError')
const appliedService = require('../services/appliedService')

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

    async getMyJobs(req, res){
        try{
            var {num, page, status} = req.query
            if (parseInt(status) != 1){
                status = false
            }
            else{
                status = true
            }
            const employer = await employerService.getEmployerByUserId(req.userId)
            if (employer == null){
                return res.status(400).json({
                    success: false,
                    message: "You are not employer"
                })
            }
            const jobs = await jobService.getJobsByEmployer(employer.id, status, num, page)
            var applies = []
            var categoriesJobs = []
            for (var i=0; i<jobs.length; i++){
                const applieds = await appliedService.getAppliedByJob(jobs[i].id, null, null)
                const categories = await categoryJobService.getCategoriesByJob(jobs[i].id)
                var temp = []
                for (var j=0; j<categories.length; j++){
                    const category = await categoryService.getCategoryById(categories[i].id)
                    temp.push(category)
                }
                categoriesJobs.push(temp)
                applies.push(applieds.length)
            }
            const allJobs = await jobService.getJobsByEmployer(employer.id, status, null, null)
            return res.status(200).json({
                message: "OK",
                jobs,
                length: allJobs.length,
                totalPages: calTotalPages(num, allJobs.length),
                applies,
                categories: categoriesJobs
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

            var categoriesJobs = []

            for (var i=0; i<jobs.length; i++){
                const categories = await categoryJobService.getCategoriesByJob(jobs[i].id)
                var temp = []
                for (var j=0; j<categories.length; j++){
                    const category = await categoryService.getCategoryById(categories[j].category)
                    temp.push(category)
                }
                categoriesJobs.push(temp)
            }

            console.log(categoriesJobs)

            return res.status(200).json({
                jobs,
                categories: categoriesJobs,
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

    async getLatestAvailableJobs(req, res, next) {
        try {
            const jobs = await jobService.getLatestAvailableJobs();
            let categoriesJobs = [];

            for (let i = 0; i < jobs.length; i++) {
                const categories = await categoryJobService.getCategoriesByJob(jobs[i].id)
                let temp = []
                for (let j = 0; j < categories.length; j++) {
                    const category = await categoryService.getCategoryById(categories[j].category)
                    temp.push(category)
                }
                categoriesJobs.push(temp)
            }

            res.status(200).json({
                success: true,
                categories: categoriesJobs,
                jobs
            });
        } catch (error) {
            next(error);
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
                    message: "You are not Owner of Job"
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


    async getAllMyJobs(req, res, next) {
        try {
            const employer = await employerService.getEmployerByUserId(req.userId);

            if (!employer) {
                throw new ApiError(403, 'You are not the owner of these jobs');
            }

            const availableJobs = await jobService.getEmployerAvailableJobs(employer.id);
            const expiredJobs = await jobService.getEmployerExpiredJobs(employer.id);
            const countAppliesByJobs = await appliedService.countAppliesByJobs();
            const appliesPerJob = {};
            for (let job of countAppliesByJobs) {
                appliesPerJob[job._id] = job.count
            };

            res.status(200).json({
                success: true,
                availableJobs,
                expiredJobs,
                appliesPerJob
            });
        } catch (error) {
            next(error)
        }
    }

    async getJobWithApplies(req, res, next) {
        try {
            const job = await jobService.getJobById(req.params.id);
            if (!job) {
                throw new ApiError(400, 'Job not found');
            }
            const applies = await appliedService.getAppliesByJobId(job._id);
            const categories = await categoryJobService.getCategoryJobsFromJobId(job._id);
            res.status(200).json({
                success: true,
                job,
                applies,
                categories
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new JobController