const Employer = require('../models/employerModel')

class EmployerService{
    async saveEmployer(employer){
        const newEmployer = new Employer(employer)

        await newEmployer.save()

        return newEmployer
    }  

    async getEmployerByUserId(userId){
        return await Employer.findOne({user: userId})
    }

    async getEmployerById(id){
        return await Employer.findById(id)
    }

    async getEmployers() {
        return await Employer.find().populate('user');
    }

    async handlePost(employer, handle, num){
        console.log("Employer")
        console.log(employer)
        console.log("NUM")
        console.log(num)
        if (handle == true){
            await Employer.findByIdAndUpdate(employer._id, { $set: {canPost: parseInt(employer.canPost) + parseInt(num)}})
        }
        else{
            await Employer.findByIdAndUpdate(employer._id, {canPost: employer.canPost - num})
        }
    }

    async editEmployer(employerId, employerData){
        await Employer.findByIdAndUpdate(employerId, {companyName: employerData.companyName, companySize: employerData.companySize, info: employerData.info, updatedAt: Date.now()})
    }

    async countEmployer() {
        return await Employer.count();
    }

    async queryEmployers(filter, options) {
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

        return  await Employer.find(filter).sort(sort).lean().populate('user');
    }
}


module.exports = new EmployerService