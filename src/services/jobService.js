const ApiError = require('../utils/ApiError');
const { Job } = require('../models');
const twentyFourHours = require('../utils/get24Hours');
const { sevenDays, thirtyDays } = require('../utils/getDays');

class JobService {
    async getJobs(num, page) {
        
        const jobs = await Job.find({status: true})
        const length = jobs.length
        if (num == null || page == null){
            return jobs
        }

        var start = (page-1)*num

        if (start > length){
            return []
        }

        var end = parseInt(start) + parseInt(num)
        if (end > length){
            end = length
        }

        return jobs.slice(start, end)

    }

    async getJobsByInfo(info){
        return await Job.find({name: {$regex: info, $options: "i"}, description: {$regex: info, $options: "i"}})
    }
    async getJobsByCategory(categoryId){
        return await Job.find({category: categoryId})
    }

    async getNumOfJobs(){
        const jobs = await Job.find({status: true})
        return jobs.length
    }

    async createJob(job) {
        return await Job.create(job);
    }

    async getJobById(id) {
        return await Job.findById(id);
    }

    async getJobsByEmployer(employerId) {
        return await Job.find({ employer: employerId });
    }

    async updateJob(id, updateBody) {

        return await Job.findByIdAndUpdate(id, { $set: updateBody }, { new: true, runValidators: true });
    }

    async changeStatus(id, status) {
        await Job.findByIdAndUpdate(id, {status: !status})
    }


    async countJobs() {
        return await Job.count();
    }


    async getJobStats24Hours() {
        const now = Date.now();
        let yesterDay = new Date(now);
        yesterDay.setDate(yesterDay.getDate() - 1);

        const jobs = await Job
            .aggregate([
                {
                    $match: {
                        createdAt: { $gte: yesterDay }
                    },
                },
                {
                    $group: {
                        _id: { $dateToString: { format: '%HH', date: '$createdAt'}},
                        count: { '$sum': 1 }
                    }
                }
            ]
        );

        const job24HoursObj = {};
        const _24hours = twentyFourHours();
        
        for (let hour in _24hours) {
            job24HoursObj[_24hours[hour]] = 0;
        }

        for (let item in jobs) {
            job24HoursObj[jobs[item]._id] = jobs[item].count;
        }

        return job24HoursObj;
    }

    async getJobStats7Day() {
        const now = Date.now();
        let past7Day = new Date(now);
        past7Day.setDate(past7Day.getDate() - 7);

        const jobs = await Job
            .aggregate([
                {
                    $match: {
                        createdAt: { $gte: past7Day }
                    },
                },
                {
                    $group: {
                        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt'}},
                        count: { '$sum': 1 }
                    }
                }
            ]
        );

        const _7Days = sevenDays();
        const daysObj = {};

        for (let day in _7Days) {
            daysObj[_7Days[day]] = 0;
        }

        for (let item in jobs) {
            daysObj[jobs[item]._id] = jobs[item].count;
        }

        return daysObj;
    }


    async getJobStats30Days() {
        const now = Date.now();
        let past30Day = new Date(now);
        past30Day.setDate(past30Day.getDate() - 30);

        const jobs = await Job
            .aggregate([
                {
                    $match: {
                        createdAt: { $gte: past30Day }
                    },
                },
                {
                    $group: {
                        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt'}},
                        count: { '$sum': 1 }
                    }
                }
            ]
        );

        const _30Days = thirtyDays();
        const daysObj = {};

        for (let day in _30Days) {
            daysObj[_30Days[day]] = 0;
        }

        for (let item in jobs) {
            daysObj[jobs[item]._id] = jobs[item].count;
        }

        return daysObj;
    }
}


module.exports = new JobService;
