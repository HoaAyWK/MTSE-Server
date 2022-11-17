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

describe('Employer', () => {
    describe('GET /api/v1/employer', () => {
        test('it should return message \'Invalid token\'', async () => {
            const res = await request(app)
                .get('/api/v1/employer')
    
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Invalid token');
        });

        test('it should return an array', async () => {
            const res = await request(app)
                .get('/api/v1/employer')
                .set({ Authorization: `Bearer ${token.body.accessToken}`});
    
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body.employers)).toBe(true);
        });
    });

    describe('POST /api/v1/employer/register', () => {
        test(`it should return message 'Email has been taken'`, async () => {
            const res = await request(app)
                .post('/api/v1/employer/register')
                .send({ email: EMPLOYER.EMAIL, password: '123456' });
            
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Email has been taken');
        });

        const data = {
            email: 'testeregister@gmail.com',
            password: '123456',
            phone: '011111111',
            address: 'Test address',
            companyName: 'Sprat Ltd',
            companySize: 50,
            companyType: 'Out sourcing'
        };

        test(`it should return message 'Register Employer Successfully'`, async () => {
            const res = await request(app)
                .post('/api/v1/employer/register')
                .send(data);
            
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Register Employer Successfully');
        });
    });
});
