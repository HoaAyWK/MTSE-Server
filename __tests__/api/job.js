require("dotenv").config();
const request = require("supertest");

let freelancerToken;
let employerToken;

const { connectDatabase, disconnectDatabase } = require('../../src/config/database');
const app = require('../../src/app');
const { EMPLOYER, FREELANCER, JOB_ID } = require('../../src/constants/constants');

beforeAll(async () => {
    await connectDatabase();
    freelancerToken = await request(app)
        .post('/api/v1/account/login')
        .send({ email: FREELANCER.EMAIL, password: FREELANCER.PASSWORD });

    employerToken = await request(app)
        .post('/api/v1/account/login')
        .send({ email: EMPLOYER.EMAIL, password: EMPLOYER.PASSWORD });
});

afterAll(async () => {
    await disconnectDatabase();
});

describe('Job', () => {
    describe('POST /api/v1/job', () => {
        test('it should return message \'Invalid token\'', async () => {
            const res = await request(app)
                .post('/api/v1/job/create')
    
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Invalid token');
        });

        test(`it should return message 'You are not Employer'`, async () => {
            const res = await request(app)
                .post('/api/v1/job/create')
                .set({ Authorization: `Bearer ${freelancerToken.body.accessToken}`});
    
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('You are not Employer');
        });

        const data = {
            name: 'Test create',
            description: 'in test',
            price: 100,
            startDate: '11-30-2022',
            expireDate: '12-30-2022'
        };

        test(`it should return message 'Create Job Successfully'`, async () => {
            const res = await request(app)
                .post('/api/v1/job/create')
                .set({ Authorization: `Bearer ${employerToken.body.accessToken}`})
                .send(data)
    
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Create Job Successfully');
        });
    });

    describe(`GET /api/v1/job/find`, () => {
        test(`it should return message 'Unknow Job'`, async () => {
            const res = await request(app)
                .get('/api/v1/job/find');
    
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Unknow Job');
        });
    });

    describe(`GET /api/v1/job/show`, () => {
        test(`it should return an array`, async () => {
            const res = await request(app)
                .get('/api/v1/job/show');
    
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body.jobs)).toBe(true);
        });
    });

    describe(`PUT /api/v1/job/status/${JOB_ID}`, () => {

        test(`it shoud return 'Unknow Job'`, async () => {
            const res = await request(app)
                .put(`/api/v1/job/status/${JOB_ID}`)
                .set({ Authorization: `Bearer ${employerToken.body.accessToken}`});
    
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Unknow Job');
        });
    })

    describe(`PUT /api/v1/job/edit`, () => {
        test(`it shoud return 'Unknow Job'`, async () => {
            const res = await request(app)
                .put(`/api/v1/job/edit`)
                .set({ Authorization: `Bearer ${employerToken.body.accessToken}`})
                .send({ jobId: JOB_ID });
    
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Unknow Job');
        });
    })
});

