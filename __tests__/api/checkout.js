require("dotenv").config();
const request = require("supertest");

let token;

const { connectDatabase, disconnectDatabase } = require('../../src/config/database');
const app = require('../../src/app');
const { EMPLOYER } = require('../../src/constants/constants');

beforeAll(async () => {
    await connectDatabase();
    token = await request(app)
        .post('/api/v1/account/login')
        .send({ email: EMPLOYER.EMAIL, password: EMPLOYER.PASSWORD });
});

afterAll(async () => {
    await disconnectDatabase();
});

describe('Checkout', () => {
    describe('GET /api/v1/checkout', () => {
        test('it should return message \'Package not found\'', async () => {
            const res = await request(app)
                .get('/api/v1/checkout')
                .set({ Authorization: `Bearer ${token.body.accessToken}`});
    
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Package not found');
        });

        test('it should message \'Invalid token\'', async () => {
            const res = await request(app)
                .get('/api/v1/checkout');
                
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Invalid token');
        });
    });
});

