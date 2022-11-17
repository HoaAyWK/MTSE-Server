require("dotenv").config();
const request = require("supertest");

let token;
let employerToken;
let freelancerToken;

const { connectDatabase, disconnectDatabase } = require('../../src/config/database');
const app = require('../../src/app');
const { ADMIN, JOB_ID, EMPLOYER, FREELANCER } = require('../../src/constants/constants');

beforeAll(async () => {
    await connectDatabase();
    token = await request(app)
        .post('/api/v1/account/login')
        .send({ email: ADMIN.EMAIL, password: ADMIN.PASSWORD });

    employerToken = await request(app)
        .post('/api/v1/account/login')
        .send({ email: EMPLOYER.EMAIL, password: EMPLOYER.PASSWORD });

    freelancerToken = await request(app)
        .post('/api/v1/account/login')
        .send({ email: FREELANCER.EMAIL, password: FREELANCER.PASSWORD });
});

afterAll(async () => {
    await disconnectDatabase();
});

describe('Applied', () => {
    describe(`GET /api/v1/applied/admin/${JOB_ID}`, () => {
        test('it should return message \'Invalid token\'', async () => {
            const res = await request(app)
                .get(`/api/v1/applied/admin/${JOB_ID}`)
    
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Invalid token');
        });

        test('it should return an array', async () => {
            const res = await request(app)
                .get(`/api/v1/applied/admin/${JOB_ID}`)
                .set({ Authorization: `Bearer ${token.body.accessToken}`});
    
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body.applieds)).toBe(true);
        });
    });

    describe(`GET /api/v1/applied/myJob/${JOB_ID}`, () => {
        test('it should return message \'Invalid token\'', async () => {
            const res = await request(app)
                .get(`/api/v1/applied/myJob/${JOB_ID}`)
    
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Invalid token');
        });

        test(`it should return message 'Unknow Job'`, async () => {
            const res = await request(app)
                .get(`/api/v1/applied/myJob/${JOB_ID}`)
                .set({ Authorization: `Bearer ${employerToken.body.accessToken}`});
    
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Unknow Job');
        });
    });

    describe(`POST /api/v1/applied/add`, () => {
        test(`it should return message 'You are not Freelancer'`, async () => {
            const res = await request(app)
                .post(`/api/v1/applied/add`)
                .set({ Authorization: `Bearer ${employerToken.body.accessToken}`})
                .send({ job: JOB_ID });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('You are not Freelancer');
        })

        test(`it should return message 'Job is Unavailable'`, async () => {
            const res = await request(app)
                .post(`/api/v1/applied/add`)
                .set({ Authorization: `Bearer ${freelancerToken.body.accessToken}`})
                .send({ job: JOB_ID });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Job is Unavailable');
        })
    });

    describe(`DELETE /api/v1/applied/cancel/${JOB_ID}`, () => {
        test(`it should return message 'You are not Freelancer'`, async () => {
            const res = await request(app)
                .delete(`/api/v1/applied/cancel/${JOB_ID}`)
                .set({ Authorization: `Bearer ${employerToken.body.accessToken}`})
                .send({ job: JOB_ID });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('You are not Freelancer');
        });

        test(`it should return message 'Unknow Your Apply'`, async () => {
            const res = await request(app)
                .delete(`/api/v1/applied/cancel/${JOB_ID}`)
                .set({ Authorization: `Bearer ${freelancerToken.body.accessToken}`})
                .send({ job: JOB_ID });

            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Unknow Your Apply');
        })
    })
});
