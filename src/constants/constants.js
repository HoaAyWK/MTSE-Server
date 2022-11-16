const ROLES = Object.freeze({
    FREELANCER: 'Freelancer',
    EMPLOYER: 'Employer',
    ADMIN: 'Admin'
});

const ADMIN = Object.freeze({
    EMAIL: 'admin@gmail.com',
    PASSWORD: '123456',
    PHONE: '0912321034',
    ADDRESS: 'Viet Name'
});

const MESSAGE_ERRORS = Object.freeze({
    UNAUTHORIZE: "You don't have permission to access this resource"
});

module.exports = {
    ROLES,
    ADMIN,
    MESSAGE_ERRORS
};
