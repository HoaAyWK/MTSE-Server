require("dotenv").config();
const request = require("supertest");

let token;

const { connectDatabase, disconnectDatabase } = require('../../src/config/database');
const app = require('../../src/app');
const { ADMIN, EMPLOYER } = require('../../src/constants/constants');

beforeAll(async () => {
    await connectDatabase();
    token = await request(app)
        .post('/api/v1/account/login')
        .send({ email: ADMIN.EMAIL, password: ADMIN.PASSWORD });
});

afterAll(async () => {
    await disconnectDatabase();
});

describe('Freelancer', () => {
    describe('GET /api/v1/freelancer', () => {
        test('it should return message \'Invalid token\'', async () => {
            const res = await request(app)
                .get('/api/v1/freelancer')
    
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Invalid token');
        });

        test('it should return an array', async () => {
            const res = await request(app)
                .get('/api/v1/freelancer')
                .set({ Authorization: `Bearer ${token.body.accessToken}`});
    
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body.freelancers)).toBe(true);
        });
    });

    describe('POST /api/v1/freelancer/register', () => {
        test(`it should return message 'Email has been taken'`, async () => {
            const res = await request(app)
                .post('/api/v1/freelancer/register')
                .send({ email: EMPLOYER.EMAIL, password: '123456' });
            
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Email has been taken');
        });

        const data = {
            email: 'testfregister@gmail.com',
            password: '123456',
            phone: '093123123',
            address: 'Test address',
            firstName: 'Test',
            lastName: 'User'
        };

        test(`it should return message 'Register Freelancer Successfully'`, async () => {
            const res = await request(app)
                .post('/api/v1/freelancer/register')
                .send(data);
            
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Register Freelancer Successfully');
        });
    });
});

