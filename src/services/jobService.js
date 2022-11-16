const ApiError = require('../utils/ApiError');
const { Job } = require('../models');

class JobService {
    async getJobs(num, page) {
        
        const jobs = await Job.find({status: true})
        const length = jobs.length
        if (num == null || page == null){
            return jobs
        }

        var start = (page-1)*num

        if (start > length){
            return []
        }

        var end = parseInt(start) + parseInt(num)
        if (end > length){
            end = length
        }

        return jobs.slice(start, end)

    }

    async getNumOfJobs(){
        const jobs = await Job.find({status: true})
        return jobs.length
    }

    async createJob(job) {
        return await Job.create(job);
    }

    async getJobById(id) {
        return await Job.findById(id);
    }

    async getJobsByEmployer(employerId) {
        return await Job.find({ employer: employerId });
    }

    async updateJob(id, updateBody) {
        const job = await Job.findById(id).lean();

        if (!job) {
            throw new ApiError(404, 'Job not found');
        }

        return await Job.findByIdAndUpdate(id, { $set: updateBody }, { new: true, runValidators: true });
    }

    async changeStatus(id, status) {
        await Job.findByIdAndUpdate(id, {status: !status})
    }
}


module.exports = new JobService;
