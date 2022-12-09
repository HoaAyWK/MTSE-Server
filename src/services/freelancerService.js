const Freelancer = require('../models/freelancerModel')

class FreelancerService{
    async saveFreelancer(freelancer){
        const newFreelancer = new Freelancer(freelancer)

        await newFreelancer.save()

        return newFreelancer
    }

    async editFreelancer(freelancerId, freelancerData){
        return await Freelancer.findByIdAndUpdate
            (freelancerId, {
                firstName: freelancerData.firstName,
                lastName: freelancerData.lastName,
                gender: freelancerData.gender
                },
                {
                    new: true
                }
            );
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

    async getTopFreelancers() {
        return await Freelancer.find().sort('-createdAt').lean().populate('user');
    }

    async countFreelancer() {
        return await Freelancer.count();
    }

    async queryFreelancers(filter, options) {
        let sort = "";

        if (options.sortBy) {
            const sortingCriteria = [];
            options.sortBy.split(",").forEach((sortOption) => {
                const [key, order] = sortOption.split(":");

                sortingCriteria.push((order === "desc" ? "-" : "") + key);
            });

            sort = sortingCriteria.join(" ");
        } else {
            sort = "createdAt";
        }

        return  await Freelancer.find(filter).sort(sort).lean().populate('user');
    }


    async updateStatus(freelancerId, status) {
        return await Freelancer.findByIdAndUpdate(freelancerId, { $set: { status }});
    };

    async getByUserIdAndLean(userId) {
        return await Freelancer.findOne({ user: userId }).lean().populate({ path: 'user', select: '_id image'});
    }

    async getByIdAndLean(freelancerId) {
        return await Freelancer.findById(freelancerId).lean().populate('user');
    }
}

module.exports = new FreelancerService
