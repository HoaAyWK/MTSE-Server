const ApiError = require('../utils/ApiError');
const { Category } = require('../models');

class CategoryService {
    async getCategories(num, page) {
        const categories = await Category.find()

        if(num == null || page == null){
            return categories
        }

        const length = categories.length

        const start = (page-1)*num
        if (start > length){
            return []
        }

        var end = parseInt(start) + parseInt(num)
        if (end > length){
            end = length
        }

        return categories.slice(start, end)
    }   


    async getNumOfCategories(){
        const categories = await Category.find()

        return categories.length
    }

    async createCategory(category) {
        return await Category.create(category);
    }

    async getCategoryById(id) {
        return await Category.findById(id);
    }

    async updateCategory(id, updateBody) {
        const category = await Category.findById(id).lean();

        if (!category) {
            throw new ApiError(404, 'Category not found');
        }

        return await Category.findByIdAndUpdate(id, { $set: updateBody }, { new: true, runValidators: true });
    }

    async deleteCategory(id) {
        const category = await Category.findById(id);

        if (!category) {
            throw new ApiError(404, 'Category not found');
        }

        await category.remove();
    }
}


module.exports = new CategoryService;
