const Freelancer = require('../models/freelancerModel')

class FreelancerService{
    async saveFreelancer(freelancer){
        const newFreelancer = new Freelancer(freelancer)

        await newFreelancer.save()

        return newFreelancer
    }

    async getFreelancerByUserId(userId){
        return await Freelancer.findOne({user: userId})
    }

    async getFreelancerById(id){
        return await Freelancer.findById(id)
    }

    async getFreelancers() {
        return await Freelancer.find().populate({ path: 'user'});
    }

    async countFreelancer() {
        return await Freelancer.count();
    }
}

module.exports = new FreelancerService