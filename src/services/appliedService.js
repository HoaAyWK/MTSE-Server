const ApiError = require('../utils/ApiError');
const { Applied } = require('../models');

class AppliedService {
    async getApplieds(num) {
        let applieds;

        if (num) {
            applieds = await Applied.find().limit(num);
        } else {
            applieds = await Applied.find();
        }

        return applieds;
    }

    async cancelApply(appliedId){
        await Applied.findByIdAndUpdate(appliedId, {status: false, canceledAt: Date.now()})
    }

    async createApplied(applied) {
        return await Applied.create(applied);
    }

    async getAppliedById(id) {
        return await Applied.findById(id);
    }

    async getAppliedsByJobForAdmin(jobId) {
        return await Applied.find({ job: jobId })
            .populate({ path: 'freelancer', populate: { path: 'user' }});
    }

    async getAppliedByJob(jobId, num, page){
        const allApplied = await Applied.find({job: jobId, status:true})
        const length = allApplied.length
        var start = (page - 1)*num
        if (start > length){
            return []
        }
        var end = parseInt(start) + parseInt(num)
        if (end > length){
            end = length
        }
        return allApplied.slice(start, end)
    }

    async getNumOfAppliedByJob(jobId){
        const allApplied = await Applied.find({job: jobId, status:true})
        return allApplied.length
    }

    async getAppliedByFreelancerAndJob(freelancerId, jobId){
        return await Applied.findOne({ freelancer: freelancerId, job: jobId });
    }

    async getAppliedByFreelancer(freelancerId) {
        return await Applied.find({ freelancer: freelancerId });
    }

    async updateApplied(id, updateBody) {
        const applied = await Applied.findById(id).lean();

        if (!applied) {
            throw new ApiError(404, 'Applied not found');
        }

        return await Applied.findByIdAndUpdate(id, { $set: updateBody }, { new: true, runValidators: true });
    }

    async deleteApplied(id) {
        const applied = await Applied.findById(id);

        if (!applied) {
            throw new ApiError(404, 'Applied not found');
        }

        await applied.remove();
    }
}


module.exports = new AppliedService;
