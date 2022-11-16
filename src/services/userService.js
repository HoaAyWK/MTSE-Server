const User = require('../models/userModel')

class UserService{
    async getUserByEmail(email){
        const user = await User.findOne({email: email})
        return user
    }

    async checkPhone(phone){
        const user = await User.find({phone})

        return user
    }

    async saveUser(user){
        const newUser = new User(user)

        await newUser.save()

        return newUser
    }

    async getUserById(userId){
        const user = await User.findById(userId)

        return user
    }

    async changeStar(userId, stars){
        await User.findByIdAndUpdate(userId, {stars})
    }


    async updateUser(userId, updateBody) {
        return await User.findByIdAndUpdate(userId, { $set: updateBody }, { new: true, runValidators: true });
    }


    async countUsers() {
        return await User.count();
    }
}

module.exports = new UserService