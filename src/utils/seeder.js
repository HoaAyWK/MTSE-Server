const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const argon2 = require('argon2');

const { User, Account, Skill, Category, Package, Employer, Freelancer, Job, Applied, TransactionHistory } = require('../models');
const { connectDatabase } = require('../config/database');
const { ADMIN, ROLES, EMPLOYER, FREELANCER } = require('../constants/constants');
const freelancerController = require('../controllers/freelancerController');

connectDatabase();

const skills = [
    { name: 'C++' },
    { name: 'Java' },
    { name: 'C#' },
    { name: 'Python' },
    { name: 'Ruby' },
    { name: 'DevOps' },
];

const categories = [
    { name: 'Website Development' },
    { name: 'Android Development' },
    { name: 'Game Development' },
    { name: 'Design UI/UX' },
    { name: 'Graphic Design' }
];

const packages = [
    { description: '3 posts/package for forever', canPost: 3, point: 3, price: 10 },
    { description: '5 posts/package for forever', canPost: 5, point: 5, price: 20 },
    { description: '10 posts/package for forever', canPost: 10, point: 10, price: 30 }
];

const seedSkills = async () => {
    try {
        await Skill.deleteMany();
        console.log('Skills are deleted');

        await Skill.insertMany(skills);
        console.log('Inserted Skills');
    } catch (error) {
        console.log(error.message);
    }
};


const seedCategories = async () => {
    try {
        await Category.deleteMany();
        console.log('Categories are deleted');

        await Category.insertMany(categories);
        console.log('Inserted Categories');
    } catch (error) {
        console.log(error.message);
    }
};

const seedPackages = async () => {
    try {
        await Package.deleteMany();
        console.log('Packages are deleted');

        await Package.insertMany(packages);
        console.log('Inserted Packages');
    } catch (error) {
        console.log(error.message);
    }
};

const seedUsers = async () => {
    try {
        

        await Freelancer.deleteMany();
        console.log('Deleted freelances');
        await Employer.deleteMany();
        console.log('Deleted employers');
        await User.deleteMany();
        console.log('Deleted users');
        await Account.deleteMany();
        console.log('Deleted accounts');
        await TransactionHistory.deleteMany();
        console.log('Deleted transacions');

        const admin = {
            email: ADMIN.EMAIL,
            phone: ADMIN.PHONE,
            address: ADMIN.ADDRESS
        };
        
        const adminUser = await User.create(admin);

        console.log('Created admin');

        const hasdPassword = await argon2.hash(ADMIN.PASSWORD);
        const adminAccount = {
            user: adminUser.id,
            password: hasdPassword,
            role: ROLES.ADMIN,
            emailConfirmed: true
        };

        await Account.create(adminAccount);

        console.log('Created admin account');

        const employer = {
            email: EMPLOYER.EMAIL,
            phone: EMPLOYER.PHONE,
            address: EMPLOYER.ADDRESS,
            introduction: EMPLOYER.INTRODUCTION,
        };

        const employerUser = await User.create(employer);

        console.log("Created employer user");

        const employerPasswordHashed = await argon2.hash(EMPLOYER.PASSWORD);

        await Account.create({
            user: employerUser.id,
            password: employerPasswordHashed,
            role: ROLES.EMPLOYER,
            emailConfirmed: true
        });

        console.log("Created employer account");

        const newEmployer = await Employer.create({
            user: employerUser.id,
            companyName: EMPLOYER.COMPANY_NAME,
            companySize: EMPLOYER.COMPANY_SIZE,
            companyType: EMPLOYER.COMPANY_TYPE,
            foundingDate: EMPLOYER.FOUNDING_DATE
        });

        console.log("Created employer");

        const freelancer = {
            email: FREELANCER.EMAIL,
            phone: FREELANCER.PHONE,
            address: FREELANCER.ADDRESS,
            introduction: FREELANCER.INTRODUCTION
        };

        const freelancerUser = await User.create(freelancer);

        console.log("Created freelancer user");

        const freelancerPasswordHashed = await argon2.hash(FREELANCER.PASSWORD);

        await Account.create({
            user: freelancerUser.id,
            password: freelancerPasswordHashed,
            role: ROLES.FREELANCER,
            emailConfirmed: true
        });

        console.log("Created freelancer account");

        const newFreelancer = await Freelancer.create({
            user: freelancerUser.id,
            firstName: FREELANCER.FIRSTNAME,
            lastName: FREELANCER.LASTNAME
        });

        console.log("Created freelancer");


        const jobs = [
            { employer: newEmployer.id, startDate: '11-25-2022', expireDate: '12-10-2022', price: 500, name: 'Nostrud labore veniam adipisicing culpa adipisicing incididunt sint consectetur laborum anim', description: 'Lorem labore esse labore nulla velit eu nisi nisi fugiat. Deserunt adipisicing minim laboris pariatur. Proident irure aliquip ut fugiat nisi sint eu tempor reprehenderit sunt cupidatat. Culpa ut est duis elit adipisicing mollit. Fugiat aliquip amet magna fugiat ut magna non qui adipisicing sunt id tempor pariatur. Magna labore excepteur tempor cillum dolor dolor aliquip. Ullamco exercitation veniam adipisicing qui ad.'},
            { employer: newEmployer.id, startDate: '11-30-2022', expireDate: '12-12-2022', price: 1000, name: 'Nostrud labore veniam adipisicing culpa adipisicing incididunt sint consectetur laborum anim', description: 'Lorem labore esse labore nulla velit eu nisi nisi fugiat. Deserunt adipisicing minim laboris pariatur. Proident irure aliquip ut fugiat nisi sint eu tempor reprehenderit sunt cupidatat. Culpa ut est duis elit adipisicing mollit. Fugiat aliquip amet magna fugiat ut magna non qui adipisicing sunt id tempor pariatur. Magna labore excepteur tempor cillum dolor dolor aliquip. Ullamco exercitation veniam adipisicing qui ad.'},
            { employer: newEmployer.id, startDate: '11-29-2022', expireDate: '12-19-2022', price: 200, name: 'Nostrud labore veniam adipisicing culpa adipisicing incididunt sint consectetur laborum anim', description: 'Lorem labore esse labore nulla velit eu nisi nisi fugiat. Deserunt adipisicing minim laboris pariatur. Proident irure aliquip ut fugiat nisi sint eu tempor reprehenderit sunt cupidatat. Culpa ut est duis elit adipisicing mollit. Fugiat aliquip amet magna fugiat ut magna non qui adipisicing sunt id tempor pariatur. Magna labore excepteur tempor cillum dolor dolor aliquip. Ullamco exercitation veniam adipisicing qui ad.'},
            { employer: newEmployer.id, startDate: '11-21-2022', expireDate: '12-21-2022', price: 700, name: 'Nostrud labore veniam adipisicing culpa adipisicing incididunt sint consectetur laborum anim', description: 'Lorem labore esse labore nulla velit eu nisi nisi fugiat. Deserunt adipisicing minim laboris pariatur. Proident irure aliquip ut fugiat nisi sint eu tempor reprehenderit sunt cupidatat. Culpa ut est duis elit adipisicing mollit. Fugiat aliquip amet magna fugiat ut magna non qui adipisicing sunt id tempor pariatur. Magna labore excepteur tempor cillum dolor dolor aliquip. Ullamco exercitation veniam adipisicing qui ad.'},
            { employer: newEmployer.id, startDate: '11-30-2022', expireDate: '12-30-2022', price: 100, name: 'Nostrud labore veniam adipisicing culpa adipisicing incididunt sint consectetur laborum anim', description: 'Lorem labore esse labore nulla velit eu nisi nisi fugiat. Deserunt adipisicing minim laboris pariatur. Proident irure aliquip ut fugiat nisi sint eu tempor reprehenderit sunt cupidatat. Culpa ut est duis elit adipisicing mollit. Fugiat aliquip amet magna fugiat ut magna non qui adipisicing sunt id tempor pariatur. Magna labore excepteur tempor cillum dolor dolor aliquip. Ullamco exercitation veniam adipisicing qui ad.'},
        ];

        await Job.deleteMany();
        console.log("Deleted jobs");

        await Job.insertMany(jobs);
        console.log("Created jobs");

        const jobData = { 
            employer: newEmployer.id,
            startDate: '11-25-2022',
            expireDate: '12-10-2022',
            price: 500,
            name: 'Nostrud labore veniam adipisicing culpa adipisicing incididunt sint consectetur laborum anim',
            description: 'Lorem labore esse labore nulla velit eu nisi nisi fugiat. Deserunt adipisicing minim laboris pariatur. Proident irure aliquip ut fugiat nisi sint eu tempor reprehenderit sunt cupidatat. Culpa ut est duis elit adipisicing mollit. Fugiat aliquip amet magna fugiat ut magna non qui adipisicing sunt id tempor pariatur. Magna labore excepteur tempor cillum dolor dolor aliquip. Ullamco exercitation veniam adipisicing qui ad.'
        };

        const newJob = await Job.create(jobData);

        await Applied.deleteMany();
        console.log("Deleted applied");

        await Applied.create({
            freelancer: newFreelancer.id,
            job: newJob.id,
        });
        
        console.log("Created applied");

        const pkg = await Package.create({
            description: '10 Posts, on top search and more',
            point: 20,
            canPost: 10,
            price: 200
        });

        await TransactionHistory.create({ user: freelancerUser.id, package: pkg.id, price: 200 });
        console.log("Created transaction");

    } catch (error) {
        console.log(error.message);
    }
}

const seedData = async () => {
    try {
        await seedCategories();
        await seedSkills();
        await seedPackages();
        await seedUsers();

        process.exit();
    } catch (error) {
        console.log(error.message);
        process.exit();
    }
}

seedData();
