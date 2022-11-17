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
    EMAIL: 'freesir@gmail.com',
    PASSWORD: '123456',
    PHONE: '0831923041',
    ADDRESS: 'Thanh Xuan, Ha Noi, Viet Nam',
    INTRODUCTION: 'Minim veniam id sit nisi laboris. Ad veniam pariatur ipsum dolore consequat ullamco esse amet voluptate consectetur incididunt labore. Id excepteur non nulla Lorem. Nostrud est esse culpa deserunt nulla do incididunt qui duis.',
    FIRSTNAME: 'Long',
    LASTNAME: 'Tran'
});

const EMPLOYER = Object.freeze({
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


const MESSAGE_ERRORS = Object.freeze({
    UNAUTHORIZE: "You don't have permission to access this resource"
});

module.exports = {
    ROLES,
    ADMIN,
    FREELANCER,
    EMPLOYER,
    MESSAGE_ERRORS
};
