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
        if (!num || !page){
            return allApplied
        }
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

    async queryApplies(fitler, options) {

        return await Applied.find(fitler)
            .sort('-appliedAt')
            .lean()
            .populate({
                path: 'job',
                populate: {
                    path: 'employer',
                    select: 'companyName',
                    populate: {
                        path: 'user',
                        select: '_id email image'
                    }
                }
            });
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

    async getAppliedByJobAndFreelancer(job, freelancer){
        return await Applied.findOne({job, freelancer})
    }

    async countAppliesByJobs() {
        return await Applied.aggregate([
            {
                $group: {
                    _id: '$job',
                    count: { $sum: 1 }
                }
            }
        ]);
    }

    async getAppliesByJobId(jobId) {
        return await Applied
            .find({ job: jobId })
            .sort('-appliedAt')
            .lean()
            .populate({ path: 'job', select: '_id employer' })
            .populate({ path: 'freelancer', populate: { path: 'user', select: '_id email phone image' }});
    }
}

module.exports = new AppliedService;
