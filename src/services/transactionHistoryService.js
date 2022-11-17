const ApiError = require('../utils/ApiError');
const { TransactionHistory } = require('../models');
const { sevenDays, thirtyDays } = require('../utils/getDays');
const twentyFourHours = require('../utils/get24Hours');

class TransactionHistoryService {
    async getTransactionHistories(num) {
        let transactionHistories;

        if (num) {
            transactionHistories = await TransactionHistory.find().limit(num).populate('user package');
        } else {
            transactionHistories = await TransactionHistory.find().populate('user package');
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

    async getStats24Hours() {
        let now = Date.now();
        let yesterDay = new Date(now);
        yesterDay.setDate(yesterDay.getDate() - 1);
        
        const transactions = await TransactionHistory
            .aggregate([
                {
                    $match: {
                        createdAt: { $gte: yesterDay }
                    },
                },
                {
                    $group: {
                        _id: { $dateToString: { format: '%HH', date: '$createdAt'}},
                        total: {
                            $sum: '$price'
                        }
                    }
                }
            ]
        );


        const _24h = twentyFourHours();

        const hoursObj = {};
        
        for (let hour in _24h) {
            hoursObj[_24h[hour]] = 0;
        }

        for (let item in transactions) {
            hoursObj[transactions[item]._id] = transactions[item].total;
        }

        return hoursObj;
    }

    async getStats30Days() {
        const now = Date.now();
        let past30Days = new Date(now);
        past30Days.setDate(past30Days.getDate() - 30);

        const transactions = await TransactionHistory.aggregate(
            [
                {
                    $match: {
                        createdAt: { $gte: past30Days }
                    },
                },
                {
                    $group: {
                        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt'}},
                        total: {
                            $sum: '$price'
                        }
                    }
                }
            ]
        );

        const daysObj = {};
        const _30Days = thirtyDays();

        for (let day in _30Days) {
            daysObj[_30Days[day]] = 0;
        }

        for (let item in transactions) {
            daysObj[transactions[item]._id] = transactions[item].total;
        }

        return daysObj;
    }
}


module.exports = new TransactionHistoryService;
