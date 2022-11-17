const categoryJobService = require('../services/categoryJobService')
const jobService = require('../services/jobService')
const userSkillService = require('../services/userSkillService')
const freelancerService = require('../services/freelancerService')
const employerService = require('../services/employerService')
const categoryService = require('../services/categoryService')
const skillService = require('../services/skillService')

class SearchController{
    async search(req, res){
        try{

            var {content} = req.body
            console.log("Content search")
            console.log(content)
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
            categoriesSearch.forEach(item => {
                if (!categories.includes(item)){
                    categories.push(item)
                }
            })

            

            var result = []
            for (var i=0; i<categories.length; i++){
                var jobsInfo = await categoryJobService.getCategoryJobsByCategory(categories[i])
                result = result.concat(jobsInfo)
            }
            var jobs = []
            for (var i=0; i<result.length; i++){
                if (i ==0 || JSON.stringify(result[i].job) != JSON.stringify(result[i-1].job._id)){
                    var job = await jobService.getJobById(result[i].job)

                    result[i].job = job
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
}

module.exports = new SearchController