const mongoose = require('mongoose');

const JOB_ID = new mongoose.Types.ObjectId();

const ROLES = Object.freeze({
    FREELANCER: 'Freelancer',
    EMPLOYER: 'Employer',
    ADMIN: 'Admin'
});

const ADMIN = Object.freeze({
    EMAIL: 'admin@gmail.com',
    PASSWORD: '123456',
    PHONE: '0912321034',
    ADDRESS: 'Viet Nam'
});

const FREELANCER = Object.freeze({
    ID: new mongoose.Types.ObjectId(),
    EMAIL: 'freesir@gmail.com',
    PASSWORD: '123456',
    PHONE: '0831923041',
    ADDRESS: 'Thanh Xuan, Ha Noi, Viet Nam',
    INTRODUCTION: 'Minim veniam id sit nisi laboris. Ad veniam pariatur ipsum dolore consequat ullamco esse amet voluptate consectetur incididunt labore. Id excepteur non nulla Lorem. Nostrud est esse culpa deserunt nulla do incididunt qui duis.',
    FIRSTNAME: 'Long',
    LASTNAME: 'Tran'
});

const CONFIRMED_EMAIL_USER = Object.freeze({
    ID: new mongoose.Types.ObjectId(),
    EMAIL: 'cfmemail@gmail.com',
    PASSWORD: '123456',
    PHONE: '0831923041',
    ADDRESS: 'Ba Dinh, Ha Noi, Viet Nam',
});

const EMPLOYER = Object.freeze({
    ID: new mongoose.Types.ObjectId(),
    EMAIL: 'emer@gmail.com',
    PASSWORD: '123456',
    PHONE: '07399123591',
    ADDRESS: 'Thu Duc, Ho Chi Minh, Viet Nam',
    INTRODUCTION: 'Minim veniam id sit nisi laboris. Ad veniam pariatur ipsum dolore consequat ullamco esse amet voluptate consectetur incididunt labore. Id excepteur non nulla Lorem. Nostrud est esse culpa deserunt nulla do incididunt qui duis.',
    COMPANY_NAME: 'Azio Ltd',
    COMPANY_SIZE: 500,
    COMPANY_TYPE: 'Production',
    FOUNDING_DATE: '10-21-2015'
});

const NO_CONFIRMED_EMAIL_USER = Object.freeze({
    EMAIL: 'nocfemail@gmail.com',
    PASSWORD: '123456',
    ADDRESS: 'Test',
    PHONE: '0132132131231'
});
 

const MESSAGE_ERRORS = Object.freeze({
    UNAUTHORIZE: "You don't have permission to access this resource"
});

module.exports = {
    ROLES,
    ADMIN,
    FREELANCER,
    EMPLOYER,
    NO_CONFIRMED_EMAIL_USER,
    CONFIRMED_EMAIL_USER,
    MESSAGE_ERRORS,
    JOB_ID
};
