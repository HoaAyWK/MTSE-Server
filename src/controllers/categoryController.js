const { categoryService, categoryJobService, accountService } = require('../services');
const { ROLES } = require('../constants/constants');
const ApiError = require('../utils/ApiError');

class CategoryController {
    async getCategories(req, res, next) {
        try {
            const num = req.query.num;
            const categories = await categoryService.getCategories(num);

            res.status(200).json({
                success: true,
                count: categories.length,
                categories
            });
        } catch (error) {
            next(error);
        }
    }

    async getCategory(res, req, next) {
        try {
            const id = req.params.id;

            if (!id) {
                throw new ApiError(400, 'Params must have id');
            }
            
            const category = await categoryService.getCategoryById(id);

            if (!category) {
                throw new ApiError(404, 'Category not found');
            }

            res.status(200).json({
                success: true,
                category
            });

        } catch (error) {
            next(error);
        }
    }

    async createCategory(req, res, next) {
        try {
            const userId = req.userId;

            const account = await accountService.getAccountByUserId(userId);

            if (!account) {
                throw new ApiError(404, 'Account not found');
            }

            if (account.role !== ROLES.ADMIN) {
                throw new ApiError(403, "You don't have permission to access this resource");
            }

            const category = await categoryService.createCategory(req.body);

            res.status(201).json({
                success: true,
                category
            });

        } catch (error) {
            next(error);
        }
    }

    async updateCategory(req, res, next) {
        try {
            const userId = req.userId;

            const account = await accountService.getAccountByUserId(userId);

            if (!account) {
                throw new ApiError(404, 'Account not found');
            }

            if (account.role !== ROLES.ADMIN) {
                throw new ApiError(403, "You don't have permission to access this resource");
            }

            const id = req.params.id;

            if (!id) {
                throw new ApiError(400, 'Params must have id');
            }

            const numOfCategoryJobs = await categoryJobService.countCategoryJobByCategory(id);

            if (numOfCategoryJobs > 0) {
                throw new ApiError(400, 'Another CategoryJob already references this category');
            }

            const category = await categoryService.updateCategory(id, req.body);

            res.status(200).json({
                success: true,
                category
            });

        } catch (error) {
            next(error);
        }
    }

    async deleteCategory(req, res, next) {
        try {
            const id = req.params.id;

            if (!id) {
                throw new ApiError(400, 'Params must have id');
            }

            const numOfCategoryJobs = await categoryJobService.countCategoryJobByCategory(id);

            if (numOfCategoryJobs > 0) {
                throw new ApiError(400, 'Another CategoryJob already references this category');
            }

            await categoryService.deleteCategory(id);

            res.status(200).json({
                success: true,
                message: "Deleted successfully"
            });

        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CategoryController;
