const ApiError = require('../utils/ApiError');
const { Job } = require('../models');

class JobService {
    async getJobs(num) {
        let jobs;

        if (num) {
            jobs = await Job.find().limit(num);
        } else {
            jobs = await Job.find();
        }

        return jobs;
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

    async deleteJob(id) {
        const job = await Job.findById(id);

        if (!job) {
            throw new ApiError(404, 'Job not found');
        }

        await job.remove();
    }
}


module.exports = new JobService;
