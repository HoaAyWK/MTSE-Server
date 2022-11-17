const { userService, transactionHistoryService } = require("../services");


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
}

module.exports = new TransactionHistoryController;
