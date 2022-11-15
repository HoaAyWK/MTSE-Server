const skillService = require('../services/skillSerivce')
const { calTotalPages } = require('../utils/page')


class SkillController{
    async createSkill(req, res){
        try{
            if (!req.userId){
                return res.status(400).json({
                    success: false,
                    message: "Unauthorization"
                })
            }
            // check admin
            /* const account = await accountService.getAccountByUserId(req.userId)

            if (account == null || account.role != 'Admin'){
                return res.status(400).json({
                    success: false,
                    message: "You are not Admin"
                })
            } */
            
            const newSkill = await skillService.createSkill(req.body)

            return res.status(200).json({
                success: true,
                message: "Create Skill Successfully",
                skill: newSkill
            })
        }
        catch(error){
            return res.status(400).json({
                success: false,
                message: "Internal Error Server"
            })
        }
    }
    
    async getSkills(req, res){
        try{
            var {num, page} = req.query

            const length = await skillService.getNumOfSkills()

            const skills = await skillService.getSkills(num, page)


            return res.status(200).json({
                skills,
                length,
                totalPages: calTotalPages(num, length)
            })
        }
        catch(error){
            console.log(error)
            return res.status(400).json({
                message: "Internal Error Server"
            })
        }
    }
}

module.exports = new SkillController