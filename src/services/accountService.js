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



    async sendEmail(options) {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            }
        });
    
        const message = {
            from: `${process.env.SMTP_FROM_NAME}<${process.env.SMTP_FROM_EMAIL}>`,
            to: options.email,
            subject: options.subject,
            html: options.message
        };
    
        await transporter.sendMail(message);
    }


    async getUnconfirmedEmailAccount() {
        return Account.find({ emailConfirmed: false }).lean();
    }
}

module.exports = new AccountService