const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const argon2 = require('argon2');

const { User, Account, Skill, Category, Package } = require('../models');
const { connectDatabase } = require('../config/database');
const { ADMIN, ROLES } = require('../constants/constants');

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
        const adminExist = await User.findOne({ email: ADMIN.EMAIL });

        if (adminExist) {
            const accountExist = await Account.findOne({ user: adminExist.id });

            if (accountExist) {
                await accountExist.remove();
                console.log('Deleted admin account');
            }

            await adminExist.remove();
            console.log('Deleted admin');
        }

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
