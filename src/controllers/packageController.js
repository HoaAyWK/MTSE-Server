const ApiError = require('../utils/ApiError');
const { packageService, accountService } = require('../services');
const transactionHistoryService = require('../services/transactionHistoryService');
const { ROLES } = require('../constants/constants');

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

            const pkg = await packageService.getPackage(id);

            res.status(200).json({
                success: true,
                package: pkg
            });
        } catch (error) {
            next(error);
        }
    }

    async createPackage(req, res, next) {
        try {
            const userId = req.userId;
            const account = await accountService.getAccountByUserId(userId);

            if (!account) {
                throw new ApiError(404, 'Account not found');
            }

            if (account.role !== ROLES.ADMIN) {
                throw new ApiError(403, "You don't have permission to access this resource");
            }

            const pkg = await packageService.createPackage(req.body);

            res.status(201).json({
                success: true,
                package: pkg
            });
        } catch (error) {
            next(error);
        }
    }

    async updatePackage(req, res, next) {
        try {
            const userId = req.userId;

            const account = await accountService.getAccountByUserId(userId);

            if (!account) {
                throw new ApiError(404, 'Account not found');
            }

            if (account.role !== ROLES.ADMIN) {
                throw new ApiError(403, "You don't have permission to access this resource");
            }
            
            const packageId = req.params.id;

            if (!packageId) {
                throw new ApiError(400, 'Params must have id');
            }

            const numOfTransactions = await transactionHistoryService.countTransactionHistoriesByPackage(packageId);

            if (numOfTransactions > 0) {
                throw new ApiError('Another TransactionHistory already references this package');
            }

            const pkg = await packageService.updatePackage(packageId, req.body);

            res.status(200).json({
                success: true,
                package: pkg
            });
        } catch (error) {
            next(error);
        }
    }

    async deletePakage(req, res, next) {
        try {
            const userId = req.userId;
            const account = await accountService.getAccountByUserId(userId);

            if (!account) {
                throw new ApiError(404, 'Account not found');
            }

            if (account.role !== ROLES.ADMIN) {
                throw new ApiError(403, "You don't have permission to access this resource");
            }

            const packageId = req.params.id;

            if (!packageId) {
                throw new ApiError(400, 'Params must have id');
            }

            const numOfTransactions = await transactionHistoryService.countTransactionHistoriesByPackage(packageId);

            if (numOfTransactions > 0) {
                throw new ApiError('Another TransactionHistory already references this package');
            }

            await packageService.deletePackage(packageId);

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
