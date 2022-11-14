const ApiError = require('../utils/ApiError');
const { Category } = require('../models');

class CategoryService {
    async getCategories(num) {
        let categories;

        if (num) {
            categories = await Category.find().limit(num);
        } else {
            categories = await Category.find();
        }

        return categories;
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
