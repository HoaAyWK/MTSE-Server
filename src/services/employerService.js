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
        console.log(employer)
        if (handle == true){
            await Employer.findByIdAndUpdate(employer._id, {canPost: employer.canPost + num})
        }
        else{
            await Employer.findByIdAndUpdate(employer._id, {canPost: employer.canPost - num})
        }
    }

    async countEmployer() {
        return await Employer.count();
    }
}


module.exports = new EmployerService