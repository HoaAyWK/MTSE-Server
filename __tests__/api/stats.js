require("dotenv").config();
const request = require("supertest");

const { connectDatabase, disconnectDatabase } = require('../../src/config/database');
const app = require('../../src/app');

beforeAll(async () => {
    await connectDatabase();
});

afterAll(async () => {
    await disconnectDatabase();
});

describe('Stats', () => {
    describe('GET /api/v1/stats', () => {
        test('it should return an array', async () => {
            const res = await request(app)
                .get('/api/v1/stats');
    
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body.data)).toBe(true);
        });

    });
});
