const { ROLES, MESSAGE_ERRORS } = require("../constants/constants");
const { userService, transactionHistoryService, accountService } = require("../services");
const ApiError = require("../utils/ApiError");


class TransactionHistoryController {
    async createTransaction(req, res, next) {
        try {
            const transaction = await transactionHistoryService.createTransactionHistory(req.body);

            res.status(201).json({
                success: true,
                transaction
            });
        } catch (error) {
            next(error);
        }
    }

    async getTransactions(req, res, next) {
        try {
            const account = await accountService.getAccountByUserId(req.userId);

            if (!account) {
                throw new ApiError(400, 'Account not found');
            }

            if (account.role !== ROLES.ADMIN) {
                throw new ApiError(403, MESSAGE_ERRORS.UNAUTHORIZE);
            }

            const transactions = await transactionHistoryService.getTransactionHistories();

            res.status(200).json({
                success: true,
                transactions
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new TransactionHistoryController;
