const categoryJobService = require('../services/categoryJobService')
const jobService = require('../services/jobService')
const userSkillService = require('../services/userSkillService')
const freelancerService = require('../services/freelancerService')
const employerService = require('../services/employerService')
const categoryService = require('../services/categoryService')
const skillService = require('../services/skillService')
const pick = require('../utils/pick');

class SearchController{
    async search(req, res){
        try{

            var {content} = req.body
            console.log("Content search")
            console.log(content)
            if (!content) {
                content = ' ';
            }
            content = content.toLowerCase()
            var content_arr = content.split(' ')


            var categoriesSearch = []
            var skillsSearch = []
            for (var i=0; i<content_arr.length; i++){
                var categoriesInfo = await categoryService.getCategoriesInfo(content_arr[i])
                categoriesInfo.forEach(item => {
                    if (!categoriesSearch.includes(item._id.toString())){
                        categoriesSearch.push(item._id.toString())
                    }
                })

                var skillsInfo = await skillService.getSkillsByInfo(content_arr[i])
                skillsInfo.forEach(item => {
                    if (!skillsSearch.includes(item._id.toString())){
                        skillsSearch.push(item._id.toString())
                    }
                })
            }
            
            console.log("Categories")
            console.log(categoriesSearch)
            console.log("Skills")
            console.log(skillsSearch)

            // jobs
            var {categories} = req.body

            categoriesSearch = categoriesSearch.concat(categories)
            categories = []
            categoriesSearch.forEach((item) => {
                if (!categories.includes(item)){
                    categories.push(item)
                }
            })

            

            var result = []
            for (var i=0; i< categories.length; i++){
                var jobsInfo = await categoryJobService.getCategoryJobsByCategory(categories[i]);
                result = result.concat(jobsInfo)
            }
            var jobs = []
            for (var i=0; i<result.length; i++){
                if (i ==0 || JSON.stringify(result[i].job) != JSON.stringify(result[i-1].job._id)){
                    var job = await jobService.getJobById(result[i].job)
                    var category = await categoryService.getCategoryById(result[i].category);
                    result[i].job = job
                    result[i].category = category;
                    jobs.push(result[i])
                }
                else{
                    continue
                }
            }

            // freelancer and employers
            var {skills} = req.body

            skillsSearch = skillsSearch.concat(skills)
            skills = []
            skillsSearch.forEach(item => {
                if (!skills.includes(item)){
                    skills.push(item)
                }
            })

            result = []
            for (var i=0; i<skills.length; i++){
                var userInfo = await userSkillService.getUsersBySkill(skills[i])
                result = result.concat(userInfo)
            }

            var freelancers = []
            var employers = []
            for (var i=0; i < result.length; i++){
                var temp = {userInfo: null, employer: null, freelancer: null}
                temp.userInfo = result[i]
                if (i == 0 || JSON.stringify(result[i].user) != JSON.stringify(result[i-1].user)){
                    var employer = await employerService.getEmployerByUserId(result[i].user)
                    if (employer){
                        temp.employer = employer
                        employers.push(temp)
                    }
                    else{
                        var freelancer = await freelancerService.getFreelancerByUserId(result[i].user)
                        temp.freelancer = freelancer
                        freelancers.push(temp)
                    }
                }
            }
            return res.json({
                jobs,
                employers,
                freelancers
            })
        }
        catch(error){
            console.log(error)
            return res.json({
                message: "Internal Error Server"
            })
        }
    }

    async getFreelancersBySkills(req, res){
        try{
            // freelancer and employers
            var {skills} = req.body

            /* skillsSearch = skillsSearch.concat(skills)
            skills = []
            skillsSearch.forEach(item => {
                if (!skills.includes(item)){
                    skills.push(item)
                }
            }) */

            var result = []
            for (var i=0; i<skills.length; i++){
                var userInfo = await userSkillService.getUsersBySkill(skills[i])
                result = result.concat(userInfo)
            }

            var freelancers = []
            for (var i=0; i < result.length; i++){
                var temp
                temp = result[i]
                if (i == 0 || JSON.stringify(result[i].user) != JSON.stringify(result[i-1].user)){
                    var freelancer = await freelancerService.getFreelancerByUserId(result[i].user)
                    if (freelancer){
                        freelancers.push(freelancer)
                    }
                }
            }

            return res.status(200).json({
                freelancers
            })
        }
        catch(error){
            console.log(error)
            return res.status(500).json({
                message: "Internal Error Server"
            })
        }
    }

    async getEmployersBySkills(req, res){
        try{
            // freelancer and employers
            var {skills} = req.body

            /* skillsSearch = skillsSearch.concat(skills)
            skills = []
            skillsSearch.forEach(item => {
                if (!skills.includes(item)){
                    skills.push(item)
                }
            }) */

            var result = []
            for (var i=0; i<skills.length; i++){
                var userInfo = await userSkillService.getUsersBySkill(skills[i])
                result = result.concat(userInfo)
            }

            var employers = []
            for (var i=0; i < result.length; i++){
                var temp
                temp = result[i]
                if (i == 0 || JSON.stringify(result[i].user) != JSON.stringify(result[i-1].user)){
                    var employer = await employerService.getEmployerByUserId(result[i].user)
                    if (employer){
                        employers.push(employer)
                    }
                }
            }

            return res.status(200).json({
                employers
            })
        }
        catch(error){
            console.log(error)
            return res.status(500).json({
                message: "Internal Error Server"
            })
        }
    }

    async getJobsByCategories(req, res){
        try{
            // jobs
            var {categories} = req.body
            var result = []
            for (var i=0; i<categories.length; i++){
                var jobsInfo = await categoryJobService.getCategoryJobsByCategory(categories[i])
                result = result.concat(jobsInfo)
            }
            var jobs = []
            for (var i=0; i<result.length; i++){
                var temp = result[i]
                if (i ==0 || JSON.stringify(result[i].job) != JSON.stringify(result[i-1].job)){
                    var job = await jobService.getJobById(temp.job)
                    jobs.push(job)
                }
                else{
                    continue
                }
            }

            return res.status(200).json({jobs})
            
        }
        catch(error){
            console.log(error)
            return res.status(500).json({
                message: "Internal Error Server"
            })
        }
    }


    async searchJobs(req, res, next) {
        try { 
            const filter = pick(req.query, ['name', 'price']);
            const options = pick(req.query, ['sortBy']);
            const { categories: filterByCategories, company, limit, page } = req.query;
            const jobs = await jobService.queryJobs(filter, options);
            const jobIds = jobs.map((item) => item._id);

            if (company) {
                const jobsByEmployer = await jobService.getJobsByEmployerName(company);

                for (let job of jobsByEmployer) {
                    if (!jobIds.includes(job._id)) {
                        jobs.push(job);
                    }
                }
            }

            const totalPage = Math.ceil(jobs.length / limit);

            const skip = limit * (page - 1);
            const take = skip + limit;

            let data = [];

            if (jobs.length < limit) {
                data = jobs;
            } else {
                data = jobs.slice(skip, take);
            }

            for (let job in data) {
                const categories = await categoryJobService.getCategoriesByJob(data[job]._id);
                data[job].categories = categories;
            }

            // console.log(data);

            res.status(200).json({
                data,
                limit,
                page,
                totalPage,
                totalItem: jobs.length
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new SearchController