const ApiError = require('../utils/ApiError');
const { TransactionHistory } = require('../models');

class TransactionHistoryService {
    async getTransactionHistories(num) {
        let transactionHistories;

        if (num) {
            transactionHistories = await TransactionHistory.find().limit(num);
        } else {
            transactionHistories = await TransactionHistory.find();
        }

        return transactionHistories;
    }

    async createTransactionHistory(transactionHistory) {
        return await TransactionHistory.create(transactionHistory);
    }

    async getTransactionHistoryById(id) {
        return await TransactionHistory.findById(id);
    }

    async countTransactionHistoriesByPackage(packageId) {
        return await TransactionHistory.count({ package: packageId });
    }

    async updateTransactionHistory(id, updateBody) {
        const transactionHistory = await TransactionHistory.findById(id).lean();

        if (!transactionHistory) {
            throw new ApiError(404, 'TransactionHistory not found');
        }

        return await TransactionHistory.findByIdAndUpdate(id, { $set: updateBody }, { new: true, runValidators: true });
    }

    async deleteTransactionHistory(id) {
        const transactionHistory = await TransactionHistory.findById(id);

        if (!transactionHistory) {
            throw new ApiError(404, 'TransactionHistory not found');
        }

        await transactionHistory.remove();
    }
}


module.exports = new TransactionHistoryService;
