const { userService, transactionHistoryService } = require("../services");


class TransactionHistoryController {
    async getStats(req, res, next) {
        try {
            const totalUser = await userService.countUsers();
            const totalEarning = await transactionHistoryService.getTotalEarning();
            const days = await transactionHistoryService.getStats7Days();
            const months = await transactionHistoryService.getStats12Months();

            res.status(200).json({
                success: true,
                data: [totalUser, totalEarning, days, months]
            });
        } catch (error) {
            next(error);
        }
    }

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
}

module.exports = new TransactionHistoryController;
