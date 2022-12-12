const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const argon2 = require('argon2');
const { User, Account, Skill, Category, Package, Employer, Freelancer, Job, Applied, TransactionHistory, CategoryJob, UserSkill } = require('../models');
const { connectDatabase } = require('../config/database');
const { ADMIN, ROLES, EMPLOYER, FREELANCER, NO_CONFIRMED_EMAIL_USER, JOB_ID, CONFIRMED_EMAIL_USER } = require('../constants/constants');
const mongoose = require('mongoose');

connectDatabase();

const websiteCateId = new mongoose.Types.ObjectId();
const androidCateId = new mongoose.Types.ObjectId();
const designCateId = new mongoose.Types.ObjectId();

const job1Id = new mongoose.Types.ObjectId();
const job2Id = new mongoose.Types.ObjectId();
const job3Id = new mongoose.Types.ObjectId();
const job4Id = new mongoose.Types.ObjectId();
const job5Id = new mongoose.Types.ObjectId();
const job6Id = new mongoose.Types.ObjectId();
const job7Id = new mongoose.Types.ObjectId();
const job8Id = new mongoose.Types.ObjectId();

const skill1Id = new mongoose.Types.ObjectId();
const skill2Id = new mongoose.Types.ObjectId();
const skill3Id = new mongoose.Types.ObjectId();
const skill4Id = new mongoose.Types.ObjectId();
const skill5Id = new mongoose.Types.ObjectId();

const skills = [
    { _id: skill1Id, name: 'C++' },
    { _id: skill2Id, name: 'Java' },
    { _id: skill3Id, name: 'C#' },
    { _id: skill4Id, name: 'Python' },
    { _id: skill5Id, name: 'Ruby' },
    { _id: skill5Id, name: 'DevOps' },
];

const categories = [
    { _id: websiteCateId, name: 'Website Development', image: 'https://firebasestorage.googleapis.com/v0/b/mtse-ba6db.appspot.com/o/files%2Favatars%2Fgame.jpg?alt=media&token=4059f13d-b9eb-4162-8507-014f644a1d13' },
    { _id: androidCateId, name: 'Android Development', image: 'https://firebasestorage.googleapis.com/v0/b/mtse-ba6db.appspot.com/o/files%2Favatars%2Fmobile.jpg?alt=media&token=104a3d52-62eb-4ce2-9d91-e917620604ec' },
    { name: 'Game Development', image: 'https://firebasestorage.googleapis.com/v0/b/mtse-ba6db.appspot.com/o/files%2Favatars%2Fgame.jpg?alt=media&token=4059f13d-b9eb-4162-8507-014f644a1d13' },
    { _id: designCateId, name: 'Design UI/UX', image: 'https://firebasestorage.googleapis.com/v0/b/mtse-ba6db.appspot.com/o/files%2Favatars%2Fuiux.jpg?alt=media&token=ccb435f5-275b-4937-8ca8-44858e15b624' },
    { name: 'Graphic Design', image: 'https://firebasestorage.googleapis.com/v0/b/mtse-ba6db.appspot.com/o/files%2Favatars%2Fgraphic.jpg?alt=media&token=c85ca9ad-64f8-4596-a3c6-3c38454c421c' }
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


const categoryJobs = [
    {
        category: websiteCateId,
        job: job1Id
    },
    {
        category: designCateId,
        job: job1Id
    },
    {
        category: websiteCateId,
        job: job2Id
    },
    {
        category: designCateId,
        job: job2Id
    },
    {
        category: androidCateId,
        job: job3Id
    },
    {
        category: androidCateId,
        job: job4Id
    },
    {
        category: designCateId,
        job: job5Id
    },
    {
        category: designCateId,
        job: job6Id
    },
    {
        category: websiteCateId,
        job: job7Id
    },
    {
        category: androidCateId,
        job: job7Id
    },
]

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

const seedCateJobs = async () => {
    try {
        await CategoryJob.deleteMany();
        console.log('CategoryJobs are deleted');

        await CategoryJob.insertMany(categoryJobs);
        console.log('Inserted categoryjobs');
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
        await UserSkill.deleteMany();
        console.log('Deleted UserSkills');

        const admin = {
            email: ADMIN.EMAIL,
            phone: ADMIN.PHONE,
            address: ADMIN.ADDRESS,
            image: `https://firebasestorage.googleapis.com/v0/b/mtse-ba6db.appspot.com/o/files%2Favatars%2Friver.jpg?alt=media&token=4bcb4978-e575-4799-aece-5a2b9f77a084`,
            introduction: `
                Ad sint laborum ullamco tempor magna. Cillum nisi mollit Lorem fugiat tempor sit cupidatat sint. Duis velit ex nostrud exercitation commodo esse irure ut fugiat ex ipsum nostrud excepteur eiusmod. Sunt Lorem non nulla quis cupidatat incididunt commodo Lorem labore aute anim ipsum. Consectetur culpa dolor elit id nostrud dolore reprehenderit amet ad ipsum cupidatat sunt. Irure fugiat non exercitation laboris ad occaecat aliqua quis officia magna non.

Enim non velit do excepteur ea incididunt enim eu duis. Deserunt sint deserunt labore aliqua nostrud. Labore consectetur quis deserunt reprehenderit aute eiusmod ad. Elit occaecat in in commodo qui cillum nulla officia quis ipsum culpa. Aliquip elit cupidatat ad ad laboris cillum voluptate nulla excepteur. In velit occaecat velit ex occaecat nulla proident est excepteur non velit sunt. Excepteur duis laborum eu occaecat Lorem.
            `
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

        const noCfEmail = {
            email: NO_CONFIRMED_EMAIL_USER.EMAIL,
            address: NO_CONFIRMED_EMAIL_USER.ADDRESS,
            phone: NO_CONFIRMED_EMAIL_USER.PHONE
        };

        const noCfEmailUser = await User.create(noCfEmail);
        const noCfEmailPasswordHashed = await argon2.hash(NO_CONFIRMED_EMAIL_USER.PASSWORD);
        
        await Account.create({
            user: noCfEmailUser.id,
            password: noCfEmailPasswordHashed,
            role: ROLES.FREELANCER,
            emailConfirmed: false
        });

        const cfmEmail = {
            email: CONFIRMED_EMAIL_USER.EMAIL,
            phone: CONFIRMED_EMAIL_USER.PHONE,
            address: CONFIRMED_EMAIL_USER.ADDRESS
        };

        const cfmEmailUser = await User.create(cfmEmail);
        const cfmPasswordHashed = await argon2.hash(CONFIRMED_EMAIL_USER.PASSWORD);

        await Account.create({
            user: cfmEmailUser.id,
            password: cfmPasswordHashed,
            role: ROLES.FREELANCER,
            emailConfirmed: true
        });

        const employer = {
            email: EMPLOYER.EMAIL,
            phone: EMPLOYER.PHONE,
            address: EMPLOYER.ADDRESS,
            introduction: EMPLOYER.INTRODUCTION,
            image: 'https://firebasestorage.googleapis.com/v0/b/mtse-ba6db.appspot.com/o/files%2Favatars%2Fhouse.jpg?alt=media&token=a5f5c7c9-3fef-47d0-8aee-6b5c47297afe'
        };

        const employerUser = await User.create(employer);
        

        const employerUser2 = await User.create({
            email: 'employer001@gmail.com',
            phone: '09123917382',
            address: 'Thu Duc, Ho Chi Minh Viet Nam',
            introduction: `
                Consequat culpa aute magna eiusmod consequat. Id ex aliquip ullamco pariatur laborum velit Lorem esse laborum id amet. Consectetur minim minim et ut do laboris cillum. Minim reprehenderit ex Lorem ipsum laborum et ex aute. Laboris in tempor sit ipsum anim.

Nisi magna cillum eiusmod adipisicing proident enim laborum duis eu consectetur velit elit. Qui eu cillum esse sit duis ea nulla aliquip sit exercitation in incididunt aute eu. Dolor aliqua aute elit amet occaecat quis minim et in. Ipsum incididunt aliquip nisi qui tempor esse ex consequat et cupidatat. Est proident mollit sit id. Velit eiusmod amet adipisicing esse qui occaecat ex.

Commodo velit dolore occaecat ea labore ut veniam aliquip elit deserunt. Laboris occaecat sit ad reprehenderit eu ullamco laborum et anim consequat dolor est. Nostrud proident minim enim ut Lorem officia sunt incididunt adipisicing laboris. Duis quis sunt reprehenderit nulla cillum excepteur amet.

Exercitation minim labore mollit qui ex pariatur tempor esse amet non culpa anim. Esse dolor minim amet esse Lorem veniam sint duis pariatur irure laboris. Adipisicing consectetur labore dolor nisi id culpa commodo.
            `,
            image: 'https://firebasestorage.googleapis.com/v0/b/mtse-ba6db.appspot.com/o/files%2Favatars%2Fgraphic.jpg?alt=media&token=c85ca9ad-64f8-4596-a3c6-3c38454c421c'
        })

        

        console.log("Created employer user");

        const employerPasswordHashed = await argon2.hash(EMPLOYER.PASSWORD);
        const employer2PasswordHashed = await argon2.hash(EMPLOYER.PASSWORD);

        await Account.create({
            user: employerUser.id,
            password: employerPasswordHashed,
            role: ROLES.EMPLOYER,
            emailConfirmed: true
        });

        await Account.create({
            user: employerUser2.id,
            password: employer2PasswordHashed,
            emailConfirmed: true
        });

        console.log("Created employer account");

        const newEmployer = await Employer.create({
            _id: EMPLOYER.ID,
            user: employerUser.id,
            companyName: EMPLOYER.COMPANY_NAME,
            companySize: EMPLOYER.COMPANY_SIZE,
            companyType: EMPLOYER.COMPANY_TYPE,
            foundingDate: EMPLOYER.FOUNDING_DATE
        });

        const newEmployer2 = await Employer.create({
            user: employerUser2.id,
            companyName: "Naka randy",
            companySize: 500,
            companyType: "Production",
            foundingDate: new Date()
        });
        
        console.log("Created employer");

        const freelancer = {
            email: FREELANCER.EMAIL,
            phone: FREELANCER.PHONE,
            address: FREELANCER.ADDRESS,
            introduction: `
                Hello,

                My name is Long Tran, and I am a Graphic Designer with more than 8 years of experience in the industry. I utilize a team of 5 other designers to help build out some truly pristine graphic assets for clients across the globe.

                I work with a mix of Adobe and Microsoft applications to accomplish all these client services, and am well-versed in all of them.

                In terms of communication and commitment, I am available 24/7, and offer fast delivery with a 100% Satisfaction Guarantee. If you have any questions, or are interested in working with me, let me know! I love bringing on new clients, and can’t wait to work with you.
            `,
            image: 'https://firebasestorage.googleapis.com/v0/b/mtse-ba6db.appspot.com/o/files%2Fcategories%2F479f07e3-ff3f-4db0-92f9-480ce800e022?alt=media&token=69f9eacd-311c-4602-9f38-f6d9fe40fe0d'
        };

        const freelancerUser = await User.create(freelancer);

        const freelacnerUser2 = await User.create({
            email: 'freelancer@gmail.com',
            phone: '013902193',
            address: 'Chau Doc, An Giang, Viet Nam',
            introduction: `
                CUTTING OUT THE BULL... WHAT'YA SEE IS WHAT YE GET... NO EYE CANDIES... NO PROMISES!.. no feel good (sometimes there are some hugs and kisses)... but i can assure you, that you'll be satisfied with the job DONE PROFESSIONALLY with lots of passion (nuff of those cringey dramas... let's get to work!... :D.. :D
            `,
            image: 'https://firebasestorage.googleapis.com/v0/b/mtse-ba6db.appspot.com/o/files%2Favatars%2F38d13a3f-5f51-4570-981d-8e839d1b75d7?alt=media&token=25fa829a-1bb1-42a3-88ad-8a9bafa4b9bd'
        });


        console.log("Created freelancer user");

        const freelancerSkills = [
            { user: freelancerUser.id, skill: skill1Id },
            { user: freelancerUser.id, skill: skill2Id },
            { user: freelancerUser.id, skill: skill3Id },
            { user: freelancerUser.id, skill: skill4Id },
            { user: freelacnerUser2.id, skill: skill2Id },
            { user: freelacnerUser2.id, skill: skill5Id },
        ];

        await UserSkill.insertMany(freelancerSkills);

        const freelancerPasswordHashed = await argon2.hash(FREELANCER.PASSWORD);

        await Account.create({
            user: freelancerUser.id,
            password: freelancerPasswordHashed,
            role: ROLES.FREELANCER,
            emailConfirmed: true
        });

        await Account.create({
            user: freelacnerUser2.id,
            password: freelancerPasswordHashed,
            role: ROLES.FREELANCER,
            emailConfirmed: true
        });

        console.log("Created freelancer account");

        const newFreelancer = await Freelancer.create({
            _id: FREELANCER.ID,
            user: freelancerUser.id,
            firstName: FREELANCER.FIRSTNAME,
            lastName: FREELANCER.LASTNAME,
            status: true,
            doneJobs: `
                Expert in translating any kind of documents like technical, games, Literature, Novel, Legal, Business plan, Financial documents, Website & Product descriptions, Amazon listings, CV, Birth & Marriage certificates, Medical report, Academic translations etc. We are master in dealing with every format like MS word, Pdf, Excel, Plain texts, PHP, HTML, inDesign, Illustrator, Photoshop and in some special localization tools like CAT, JSON, .RESX, Transifex, , Translateit, .POeditor, WordPress.
            `
        });

        const freelancerId2 = new mongoose.Types.ObjectId();
        const newFreelancer2 = await Freelancer.create({
            _id: freelancerId2,
            user: freelacnerUser2.id,
            firstName: "Lucas",
            lastName: "Wrant",
            status: true,
            doneJobs: `
            I have more 10 years of experience in Server Linux. I can manager servers dedicated, servesr VPS, servers shared, etc.

            Setup and management you server; Apache/Nginx/Tomcat. SMTP Postfix, POP/IMAP Dovecot. FTP Vsftpd, Proftpd, Pure-ftpd-mysql. Dns Bind9, dnsmasq. File Server & printer Samba (dc-ac). Network administrator: isc-server-dhcp, openvpn, etc. Install and renew SSL certicate. All services on cloud; AWS, Azure, etc.
            `
        });

        console.log("Created freelancer");


        const jobs = [
            { 
                _id: job1Id,
                employer: newEmployer.id,
                startDate: '11-25-2022',
                expireDate: '12-10-2022',
                price: 500,
                name: 'Creative logo designer',
                description: 
                `
                Hello, I am in need of a creative logo designer with graphic design. I want a creative logo design that can be implemented for a restaurant logo and t shirts for the staff. The restaurant is still being designed and finalised. The design will be health related, so like broccoli on the logo or something healthy. Please be creative. The name is The Health Hive. I need someone fast and creative ! Thank you!
                `
            },
            {
                _id: job2Id,
                employer: newEmployer.id,
                startDate: '11-30-2022',
                expireDate: '12-12-2022',
                price: 1000,
                name: 'Editor for Reels & Pictures, Colour correction & transitions ',
                description: `
                Looking for someone who can edit all videos and pictures for my Instagram page. I post Beauty related content and need someone who can colour correct, edit, add transitions and give me high quality videos & pictures. The current project i have is just editing one reel , transitions and colour corrections included.
                `
            },
            { 
                _id: job3Id,
                employer: newEmployer.id,
                startDate: '11-29-2022',
                expireDate: '12-19-2022',
                price: 200,
                name: 'Design and build wordpress website',
                description:
                `
                We have our website please go through it. It have unfinished work so we need someone who will able to complete the work and also change the hosting service/server with all the data transfer. And create simple website builder/editor for sub admin. Import and Export multiple products with multiple excel format such as woo commerce, shopify, etc.
                `
            },
            {
                _id: job8Id,
                employer: newEmployer.id,
                startDate: '11-21-2022',
                expireDate: '12-21-2022',
                price: 700,
                name: 'Critical Analysis Paper Regarding BLM and Black Consciousness ',
                description: `
                We are looking for a REAL good translator, from english to spanish. MUST have experience in online marketing.

                There is a 300 word test if you are willing to do, please bid.
                
                We are PRO translators, and we will evaluate this translations and determine which is best.
                
                Be advise, that you will waste your time if you bid and do the test just to look for an easy gig.
                
                This is not a simple job, it requires a truly talented translator to be able to change words and wording to sound natural in spanish, and to know how to translate marketing terminology the RIGHT way not the way you find on Google.
                
                We are NOT looking for automatic translations, we know almost all the free programs out there, if you use them is fine, but you need to edit it to make it readable for the hispanic market.
                
                Tell me your experience, introduce your self according to this description. We ignore automatic bids. We have a competitive payment. You can earn up to 1000 USD a month.
                `
            },
            {
                _id: job4Id,
                employer: newEmployer.id,
                startDate: '11-30-2022',
                expireDate: '12-30-2022',
                price: 100,
                name: 'Android and iOS app development',
                description: `- User can navigate a Google Earth like user interface, to browse for certain meta data meshed over it.

                - Flutter based app development support both iOS and Android.

                - First milestone will only for the Android app.

                - Ready for Google Play submission Firebase backend (or other common backend infrastructure) with basic communication with the app`
            },
            {
                _id: job5Id,
                employer: newEmployer2.id,
                startDate: '12-10-2022',
                expireDate: '12-30-2022',
                price: 500,
                name: 'Bilingual voiceover assignment',
                description: `
                    Looking to hire a bilingual Asian voiceover talent who can gloss English to Asian audios and record a voice over for it. You will be given an English audio to simply construe them to Asian and read it at the proper timing. We are looking for bi-lingual long term work with a good and reliable voice over.  Thanks!
                `
            },
            {
                _id: job6Id,
                employer: newEmployer2.id,
                startDate: '12-10-2022',
                expireDate: '12-30-2022',
                price: 2000,
                name: '3D house design to plan extension ',
                description: `
                In the planning stage for house renovations and extension . Main areas to focus 1) Extend porch to make it foyer 2) extend front balcony to make it void for the foyer ( remove front balcony) 3) Extend Alfresco area to 3 metre and 8 metre on either side to create large living space . Would like to see it in 3D
                `
            },
            {
                _id: job7Id,
                employer: newEmployer2.id,
                startDate: '12-12-2022',
                expireDate: '12-30-2022',
                price: 1500,
                name: 'Photoshop photo blur background',
                description: `
                I want to use the attached picture in a Christmas present (memorial frame), but I would like to blur out or de-emphasize the background. Foreground of the picture needs to be as high quality as possible, and the area I’ll actually be using is a square shape that will crop out most everything but the person and dog.
                `
            },
        ];

        await Job.deleteMany();
        console.log("Deleted jobs");

        await Job.insertMany(jobs);
        console.log("Created jobs");

        const jobData = { 
            _id: JOB_ID,
            employer: newEmployer.id,
            startDate: '11-25-2022',
            expireDate: '12-10-2022',
            price: 500,
            name: 'Access Database ',
            description: `
                Need to create access database out of Microsoft excel exisiting file in such a manner the file output gets split as per my specific criteria not to mention also need an automated additional column for calculating a column values
            `
        };

        const newJob = await Job.create(jobData);

        await Applied.deleteMany();
        console.log("Deleted applied");

        await Applied.create({
            freelancer: newFreelancer.id,
            job: newJob.id,
        });

        const applies = [
            {
                job: job1Id,
                freelancer: newFreelancer.id,
            },
            {
                job: job2Id,
                freelancer: newFreelancer.id,
            },
            {
                job: job3Id,
                freelancer: newFreelancer.id,
            },
            {
                job: job4Id,
                freelancer: newFreelancer2.id,
            },
            {
                job: job5Id,
                freelancer: newFreelancer2.id,
            },
            {
                job: job2Id,
                freelancer: newFreelancer2.id,
            },
            {
                job: job7Id,
                freelancer: newFreelancer2.id,
            }
        ];

        await Applied.insertMany(applies);
        
        console.log("Created applied");

        const pkg = await Package.create({
            description: '10 Posts, on top search and more',
            point: 20,
            canPost: 10,
            price: 200
        });

        await TransactionHistory.create({ user: freelancerUser.id, package: pkg.id, price: 200 });

        await TransactionHistory.create({ user: freelacnerUser2.id, package: pkg.id, price: 200 });
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
        await seedCateJobs();

        process.exit();
    } catch (error) {
        console.log(error.message);
        process.exit();
    }
}

seedData();
