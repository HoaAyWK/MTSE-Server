const Account = require('../models/accountModel')
const argon2 = require('argon2')

class AccountService{
    async saveAccount(account){
        const hashPassword = await argon2.hash(account.password)

        account.password = hashPassword

        const newAccount = new Account(account)

        newAccount.save()

        return account
    }

    async checkPassword(account, password){
        const checkedPassword = await argon2.verify(account.password, password)

        return checkedPassword
    }

    async getAccountByUserId(userId){
        const account = await Account.findOne({user: userId})

        return account
    }

    async changePassword(accountId, newPassword){
        const hashPassword = await argon2.hash(newPassword)

        await Account.findByIdAndUpdate(accountId, {password: hashPassword})
    }
}

module.exports = new AccountService