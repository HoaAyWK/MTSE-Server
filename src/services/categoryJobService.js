const ApiError = require('../utils/ApiError');
const { CategoryJob } = require('../models');


class JobCategoryService {
    async getCategoryJobs() {
        return await CategoryJob.find();
    }


    async getCategoryJobsByCategory(categoryId) {
        return await CategoryJob.find({ category: categoryId });
    }


    async deleteAllCategoriesByJob(jobId){
        const categories = await CategoryJob.find({job: jobId})
        for (var i=0; i<categories.length; i++){
            await CategoryJob.findByIdAndDelete(categories[i].id)
        }
    }

    async createCategoryJob(categoryJob) {
        return await CategoryJob.create(categoryJob);
    }

    async countCategoryJobByCategory(categoryId) {
        return await CategoryJob.count({ category: categoryId });
    }

    async getCategoriesByJob(jobId){
        return await CategoryJob.find({job: jobId})
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

module.exports = new JobCategoryService;
