const freelancerService = require('../services/freelancerService')
const userService = require('../services/userService')
const accountService = require('../services/accountService')
const userSkillService = require('../services/userSkillService')
const skillService = require('../services/skillService')
const commentService = require('../services/commentService')
const ApiError = require('../utils/ApiError')
const { ROLES, MESSAGE_ERRORS } = require('../constants/constants')
const getStreamService = require('../services/getStreamService')

class FreelancerController {
    async registerFreelancer(req, res) {
        try {
            const checkEmail = await userService.getUserByEmail(req.body.email)

            if (checkEmail) {
                return res.status(400).json({
                    success: false,
                    message: 'Email has been taken'
                })
            }

            const newUser = await userService.saveUser(req.body)
            req.body.user = newUser.id
            await accountService.saveAccount(req.body)
            await freelancerService.saveFreelancer(req.body)

            return res.status(200).json({
                success: true,
                message: "Register Freelancer Successfully"
            })
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error Internal Server"
            })
        }
    }

    async getFreelancers(req, res, next) {
        try {
            /* const account = await accountService.getAccountByUserId(req.userId);

            if (!account) {
                throw new ApiError(400, 'Account not found');
            }

            if (account.role !== ROLES.ADMIN) {
                throw new ApiError(403, MESSAGE_ERRORS.UNAUTHORIZE);
            }
 */
            
            const freelancers = await freelancerService.getFreelancers();
            var freelancersSkills = []
            var numComments = []
            for (var i=0; i<freelancers.length; i++){
                const user = freelancers[i].user
                const userSkills = await userSkillService.getUserSkillsByUser(user._id)
                for (var j=0; j<userSkills.length; j++){
                    const skill = await skillService.getSkillById(userSkills[j].skill)
                    userSkills[j] = skill
                }
                const comments = await commentService.getCommentsByReceiver(user._id)
                numComments.push(comments.length)
                freelancersSkills.push(userSkills)
            }

            res.status(200).json({
                success: true,
                freelancers,
                freelancersSkills,
                numComments
            });
        } catch (error) {
            next(error);
        }
    }

    async editFreelancer(req, res){
        try{
            if (!req.userId){
                return res.status(400).json({
                    success: false,
                    message: "Unauthorization"
                })
            }

            const account = await accountService.getAccountByUserId(req.userId)
            const freelancer = await freelancerService.getFreelancerByUserId(req.userId)
            if (account == null || account.role != "Freelancer" || freelancer == null){
                return res.status(400).json({
                    success: false,
                    message: "Unknow Freelancer"
                })
            }

            const upadtedFreelancer = await freelancerService.editFreelancer(freelancer.id, req.body)

            // if (upadtedFreelancer) {
            //     const { firstName, lastName } = req.body;
            //     const name = firstName + ' ' + lastName;
            //     await getStreamService.updateUserName(req.userId, name)
            // }
            

            return res.status(200).json({
                success: true,
                message: "Edit Information Successfully"
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

    async turnOnFindJob(req, res, next) {
        try {
            const freelancer = await freelancerService.getFreelancerByUserId(req.userId);

            await freelancerService.updateStatus(freelancer.id, true);
            res.status(200).json({
                success: true,
                message: 'Turned On'
            });
        } catch (error) {
            next(error);
        }
    }

    async turnOffFindJob(req, res, next) {
        try {
            const freelancer = await freelancerService.getFreelancerByUserId(req.userId);

            await freelancerService.updateStatus(freelancer.id, false);
            res.status(200).json({
                success: true,
                message: 'Turned Off'
            });
        } catch (error) {
            next(error);
        }
    }

    async getInfo(req, res){
        try{
            const {id} = req.query

            const freelancer = await freelancerService.getFreelancerById(id)

            const user = await userService.getUserById(freelancer.user)

            return res.status(200).json({
                freelancer,
                user
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

    async getTopFreelancers(req, res, next) {
        try {
            let freelancers = await freelancerService.getTopFreelancers();
            const unconfirmedEmailAccount = await accountService.getUnconfirmedEmailAccount();
            const uceaIds = unconfirmedEmailAccount.map((account) => account.user.toString());

            for (let item in freelancers) {
                console.log(freelancers[item].user);
                const userId = freelancers[item].user._id.toString();

                if (uceaIds.includes(userId)) {
                    freelancers[item] = null;
                }
            }

            freelancers = freelancers.filter(f => f !== null);

            res.status(200).json({
                success: true,
                freelancers
            });
        } catch (error) {
            next(error);
        }
    }

    async getSingle(req, res, next) {
        try {
            const freelancer = await freelancerService.getByIdAndLean(req.params.id);
            const userSkills = await userSkillService.getUKByUserAndLean(freelancer.user._id);
            freelancer['userSkills'] = userSkills;
            
            res.status(200).json({
                success: true,
                freelancer
            });
        } catch (error) {
            next(error);
        }
    }
}


module.exports = new FreelancerController