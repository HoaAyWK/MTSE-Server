const ApiError = require('../utils/ApiError');
const { TransactionHistory } = require('../models');
const sevenDays = require('../utils/getDays');
const { getPast12Months } = require("../utils/getMonths");
const twentyFourHours = require('../utils/get24Hours');

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

    async getTotalEarning() {
        const total = await TransactionHistory.aggregate([
            { $group: { _id: null, amount: { $sum: "$price" }}}
        ]);

        return total;
    }

    async getStats7Days() {
        const now = new Date();
        const toDay = now.setHours(0, 0, 0, 0);
        let pastSevenDay = new Date(toDay);
        pastSevenDay.setDate(pastSevenDay.getDate() - 7);

        const _24h = twentyFourHours();

        console.log(_24h);

        const transactions = await TransactionHistory
            .aggregate([
                {
                    $match: {
                        createdAt: { $gte: pastSevenDay }
                    },
                },
                {
                    $group: {
                        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt'}},
                        total: {
                            $sum: '$price'
                        }
                    },
                },
            ]
        );

        const _7Days =  sevenDays();

        const dayObj = {}
        for (let day in _7Days) {
            dayObj[_7Days[day]] = 0;
        }

        for (let item in transactions) {
            dayObj[transactions[item]._id] = transactions[item].total;
        }

        return dayObj;
    }


    async getStats12Months() {
        let thisDayLastYear = new Date();
        thisDayLastYear.setDate(thisDayLastYear.getDate() - 365);

        const past12Months = getPast12Months();

        const transactions = await TransactionHistory
            .aggregate([
                {
                    $match: {
                        createdAt: { $gte: thisDayLastYear }
                    },
                },
                {
                    $group: {
                        _id: { month: '$month'},
                        total: {
                            $sum: '$price'
                        }
                    },
                },
            ]
        );

        const monthsObj = {};

        for (let month in past12Months) {
            monthsObj[past12Months[month]] = 0;
        }

        for (let item in transactions) {
            monthsObj[transactions[item]._id.month] = transactions[item].total;
        }

        return monthsObj;
    }
}


module.exports = new TransactionHistoryService;
