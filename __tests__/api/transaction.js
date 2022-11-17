require("dotenv").config();
const request = require("supertest");

const { connectDatabase, disconnectDatabase } = require('../../src/config/database');
const app = require('../../src/app');

const { ADMIN } = require('../../src/constants/constants');

let adminToken;

beforeAll(async () => {
    await connectDatabase();

    adminToken = await request(app)
        .post('/api/v1/account/login')
        .send({ email: ADMIN.EMAIL, password: ADMIN.PASSWORD });
});

afterAll(async () => {
    await disconnectDatabase();
});

describe('Transaction', () => {
    describe('GET /api/v1/transactions', () => {
        test('it should return message \'Invalid token\'', async () => {
            const res = await request(app)
                .get('/api/v1/transactions');
    
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Invalid token');
        });

        test('it should return an array', async () => {
            const res = await request(app)
                .get('/api/v1/transactions')
                .set({ Authorization: `Bearer ${adminToken.body.accessToken}`})
    
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body.transactions)).toBe(true);
        });
    });
});
