const ApiError = require('../utils/ApiError');
const { Job } = require('../models');
const twentyFourHours = require('../utils/get24Hours');
const { sevenDays, thirtyDays } = require('../utils/getDays');
const { toJSON } = require('../models/plugins');

class JobService {
    async getJobs(num, page) {
        
        const jobs = await Job.find({status: true}).populate({ path: 'employer', populate: { path: 'user' }}).sort('-createdAt');
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

    async getLatestAvailableJobs() {
        return await Job.find({ expireDate: { $gt: new Date() }})
            .populate({ path: 'employer', populate: { path: 'user' }})
            .sort('-createdAt');
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
        return await Job.findById(id).lean().populate({ path: 'employer', populate: { path: 'user' }});
    }

    /* async getJobsByEmployer(employerId) {
        return await Job.find({ employer: employerId });
    } */

    async updateJob(id, updateBody) {

        return await Job.findByIdAndUpdate(id, { $set: updateBody }, { new: true, runValidators: true });
    }

    async getJobsByEmployer(employerId, status, num, page){
        const jobs = await Job.find({employer: employerId, status})
        if (!num || !page){
            return jobs
        }
        const length = jobs.length

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

    async queryJobs(filter, options) {
        let sort = "";

        if (options.sortBy) {
            const sortingCriteria = [];
            options.sortBy.split(",").forEach((sortOption) => {
                const [key, order] = sortOption.split(":");

                sortingCriteria.push((order === "desc" ? "-" : "") + key);
            });

            sort = sortingCriteria.join(" ");
        } else {
            sort = "createdAt";
        }

        return  await Job.find(filter).sort(sort).lean().populate({ path: 'employer', populate: { path: 'user' }});
    }

    async getJobsByEmployerName(name) {
        return await Job.aggregate([
            {
                $lookup: {
                    'from': 'employers',
                    'localField': 'employer',
                    'foreignField': '_id',
                    'as': 'employer'
                }
            },
            {
                $unwind: {
                    'path': '$employer'
                }
            },
            {
                '$match': {
                    'employer.companyName': {
                        $regex: name, $options: 'i'
                    }
                }
            }
        ]);
    }

    async getEmployerAvailableJobs(employerId) {
        const toDay = new Date();
        return await Job.find({ employer: employerId, expireDate: { $gt: toDay } }).lean();
    }

    async getEmployerExpiredJobs(employerId) {
        const toDay = new Date();
        return await Job.find({ employer: employerId, expireDate: { $lte: toDay } }).lean();
    }
}


module.exports = new JobService;
