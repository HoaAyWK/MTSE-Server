const Freelancer = require('../models/freelancerModel')

class FreelancerService{
    async saveFreelancer(freelancer){
        const newFreelancer = new Freelancer(freelancer)

        await newFreelancer.save()
    }
}

module.exports = new FreelancerService