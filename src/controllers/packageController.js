const ApiError = require('../utils/ApiError');
const { packageService } = require('../services/packageService');
const transactionHistoryService = require('../services/transactionHistoryService');

class PackageController {
    async getPackages(req, res, next) {
        try {
            const num = req.query.num;
            const packages = await packageService.getPackages(num);

            res.status(200).json({
                success: true,
                count: packages.length,
                packages
            });
        } catch (error) {
            next(error);
        }
    }

    async getPackage(req, res, next) {
        try {
            const id = req.params.id;

            if (!id) {
                throw new ApiError(400, 'Params must have id');
            }

            const package = await packageService.getPackage(id);

            res.status(200).json({
                success: true,
                package
            });
        } catch (error) {
            next(error);
        }
    }

    async createPackage(req, res, next) {
        try {
            const package = await packageService.createPackage(req.body);

            res.status(201).json({
                success: true,
                package
            });
        } catch (error) {
            next(error);
        }
    }

    async updatePackage(req, res, next) {
        try {
            const packageId = req.params.id;

            if (!packageId) {
                throw new ApiError(400, 'Params must have id');
            }

            const numOfTransactions = await transactionHistoryService.countTransactionHistoriesByPackage(packageId);

            if (numOfTransactions > 0) {
                throw new ApiError('This package already refer by another TransactionHistory');
            }

            const package = await packageService.updatePackage(packageId, req.body);

            res.status(200).json({
                success: true,
                package
            });
        } catch (error) {
            next(error);
        }
    }

    async deletePakage(req, res, next) {
        try {
            const packageId = req.params.id;

            if (!packageId) {
                throw new ApiError(400, 'Params must have id');
            }

            const numOfTransactions = await transactionHistoryService.countTransactionHistoriesByPackage(packageId);

            if (numOfTransactions > 0) {
                throw new ApiError('This package already refer by another TransactionHistory');
            }

            await packageService.deletePakage(packageId);

            res.status(200).json({
                success: true,
                message: 'Deleted successfully'
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new PackageController;
