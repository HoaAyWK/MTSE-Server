const { transactionHistoryService } = require('../services');
const jobService = require('../services/jobService');
const freelancerService = require('../services/freelancerService');
const employerService = require('../services/employerService');

class StatsController {
    async getStats(req, res, next) {
        try {
            const totalFreelancer = await freelancerService.countFreelancer();
            const totalEmployer = await employerService.countEmployer();
            const totalEarning = await transactionHistoryService.getTotalEarning();
            const transaction7Days = await transactionHistoryService.getStats7Days();
            const transaction30Days = await transactionHistoryService.getStats30Days();
            const transaction24Hours = await transactionHistoryService.getStats24Hours();
            const totalJob = await jobService.countJobs();
            const job7Days = await jobService.getJobStats7Day();
            const job30Days = await jobService.getJobStats30Days();
            const job24Hours = await jobService.getJobStats24Hours();

            res.status(200).json({
                success: true,
                data: [
                    totalEmployer,
                    totalFreelancer,
                    totalEarning,
                    totalJob,
                    transaction7Days,
                    transaction30Days,
                    transaction24Hours,
                    job7Days,
                    job30Days,
                    job24Hours
                ]
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new StatsController;
