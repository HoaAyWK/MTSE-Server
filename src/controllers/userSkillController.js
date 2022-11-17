const userSkillService = require('../services/userSkillService')
const userService = require('../services/userService')
class UserSkillController{
    async addSkills(req, res){
        try{
            if(!req.userId){
                return res.status(400).json({
                    success: false,
                    message: "Unauthorization"
                })
            }

            const user = await userService.getUserById(req.userId)
            if (user == null){
                return res.status(400).json({
                    success: false,
                    message: "User Not Found"
                })
            }

            const {skills} = req.body

            for (var i=0; i<skills.length; i++){
                await userSkillService.createUserSkill({user: user.id, skill: skills[i]})
            }

            return res.status(200).json({
                success: true,
                message: "Create Skills Successfully"
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

module.exports = new UserSkillController