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
}


module.exports = new EmployerService