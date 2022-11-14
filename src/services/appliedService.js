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

    async createApplied(applied) {
        return await Applied.create(applied);
    }

    async getAppliedById(id) {
        return await Applied.findById(id);
    }

    async getAppliedsByFreelancer(freelancerId) {
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
