const ApiError = require('../utils/ApiError');
const { CategoryJob } = require('../models');


class CategoryJobService {
    async getCategoryJobs() {
        return await CategoryJob.find();
    }


    async getCategoryJobsByCategory(categoryId) {
        return await CategoryJob.find({ category: categoryId });
    }

    async createCategoryJob(categoryJob) {
        return await CategoryJob.create(categoryJob);
    }

    async countCategoryJobByCategory(categoryId) {
        return await CategoryJob.count({ category: categoryId });
    }

    async updateCategoryJob(id, updateBody) {
        const categoryJob = await CategoryJob.findById(id).lean();

        if (!categoryJob) {
            throw new ApiError(404, 'CategoryJob not found');
        }

        return await CategoryJob.findByIdAndUpdate(id, { $set: updateBody }, { new: true, runValidators: true });
    }

    async deleteCategoryJob(categoryJobId) {
        const categoryJob = await CategoryJob.findById(categoryJobId);

        if (!categoryJob) {
            throw new ApiError(404, 'CategoryJob not found');
        }

        await categoryJob.remove();
    }
}

module.exports = new CategoryJobService;
